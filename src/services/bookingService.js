const Booking = require('../models/booking');
const Room = require('../models/room');
const Accommodation = require('../models/accommodation');
const User = require('../models/User');
//const emailService = require('./emailService');
const { AppError } = require('../utils/errorHandler');

// Use global sequelize instance
const { sequelize } = global;

/**
 * 새로운 예약을 생성합니다.
 * 
 * @param {Object} bookingData - 예약 정보
 * @returns {Promise<Object>} 생성된 예약 정보
 */
exports.createBooking = async (bookingData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // 객실 정보 조회
    const room = await Room.findByPk(bookingData.room_id, {
      include: [Accommodation],
      transaction
    });
    
    if (!room) {
      throw new AppError('해당 객실을 찾을 수 없습니다.', 404);
    }
    
    // 객실 가용성 확인
    const isAvailable = await checkRoomAvailability(
      room.id,
      bookingData.check_in_date,
      bookingData.check_out_date,
      transaction
    );
    
    if (!isAvailable) {
      throw new AppError('선택한 날짜에 예약 가능한 객실이 없습니다.', 400);
    }
    
    // 객실 수용 인원 확인
    const totalGuests = bookingData.adults + (bookingData.children || 0);
    const roomCapacity = room.capacity_adults + room.capacity_children;
    
    if (totalGuests > roomCapacity) {
      throw new AppError(`선택한 객실은 최대 ${roomCapacity}명까지 수용 가능합니다.`, 400);
    }
    
    // 체크인/체크아웃 날짜 유효성 검사
    const checkInDate = new Date(bookingData.check_in_date);
    const checkOutDate = new Date(bookingData.check_out_date);
    
    if (checkInDate >= checkOutDate) {
      throw new AppError('체크아웃 날짜는 체크인 날짜 이후여야 합니다.', 400);
    }
    
    // 숙박 일수 계산
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // 총 가격 계산
    const totalPrice = room.price_per_night * nights;
    
    // 예약 생성
    const booking = await Booking.create({
      ...bookingData,
      total_price: totalPrice,
      currency: room.currency,
      status: 'confirmed',
      payment_status: 'pending'
    }, { transaction });
    
    // 트랜잭션 커밋
    await transaction.commit();
    
    // 예약 확인 이메일 발송
    // await sendBookingConfirmationEmail(booking, room);
    
    return booking;
  } catch (error) {
    // 트랜잭션 롤백
    await transaction.rollback();
    throw error;
  }
};

/**
 * 객실의 특정 날짜 가용성을 확인합니다.
 * 
 * @param {number} roomId - 객실 ID
 * @param {string} checkInDate - 체크인 날짜
 * @param {string} checkOutDate - 체크아웃 날짜
 * @param {Object} transaction - 트랜잭션 객체
 * @returns {Promise<boolean>} 가용성 여부
 */
const checkRoomAvailability = async (roomId, checkInDate, checkOutDate, transaction) => {
  // 해당 기간에 이미 예약된 객실이 있는지 확인
  const existingBookings = await Booking.findAll({
    where: {
      room_id: roomId,
      status: 'confirmed',
      [sequelize.Op.or]: [
        {
          // 체크인 날짜가 기존 예약 기간 내에 있는 경우
          check_in_date: {
            [sequelize.Op.between]: [checkInDate, checkOutDate]
          }
        },
        {
          // 체크아웃 날짜가 기존 예약 기간 내에 있는 경우
          check_out_date: {
            [sequelize.Op.between]: [checkInDate, checkOutDate]
          }
        },
        {
          // 기존 예약이 새 예약 기간을 포함하는 경우
          [sequelize.Op.and]: [
            {
              check_in_date: {
                [sequelize.Op.lte]: checkInDate
              }
            },
            {
              check_out_date: {
                [sequelize.Op.gte]: checkOutDate
              }
            }
          ]
        }
      ]
    },
    transaction
  });
  
  return existingBookings.length === 0;
};

/**
 * 예약 확인 이메일을 발송합니다.
 * 
 * @param {Object} booking - 예약 정보
 * @param {Object} room - 객실 정보
 */
const sendBookingConfirmationEmail = async (booking, room) => {
  try {
    // 시스템 설정에서 이메일 템플릿 가져오기
    const SystemSettings = require('../models/SystemSettings');
    const emailTemplate = await SystemSettings.findOne({
      where: { setting_key: 'booking_confirmation_email' }
    });
    
    if (!emailTemplate) {
      console.error('예약 확인 이메일 템플릿을 찾을 수 없습니다.');
      return;
    }
    
    // 템플릿 변수 치환
    let emailContent = emailTemplate.setting_value;
    emailContent = emailContent.replace('{{first_name}}', booking.first_name);
    emailContent = emailContent.replace('{{last_name}}', booking.last_name);
    emailContent = emailContent.replace('{{check_in_date}}', booking.check_in_date);
    emailContent = emailContent.replace('{{check_out_date}}', booking.check_out_date);
    emailContent = emailContent.replace('{{accommodation_name}}', room.Accommodation.name);
    emailContent = emailContent.replace('{{room_name}}', room.name);
    emailContent = emailContent.replace('{{total_price}}', booking.total_price);
    emailContent = emailContent.replace('{{currency}}', booking.currency);
    
    // 이메일 발송
    await emailService.sendEmail({
      to: booking.email,
      subject: '[Bookion] 예약이 확정되었습니다',
      html: emailContent
    });
  } catch (error) {
    console.error('예약 확인 이메일 발송 중 오류:', error);
    // 이메일 발송 실패는 예약 프로세스를 중단시키지 않음
  }
};

/**
 * 예약 정보를 조회합니다.
 * 
 * @param {number} id - 예약 ID
 * @returns {Promise<Object>} 예약 정보
 */
exports.getBookingById = async (id) => {
  const booking = await Booking.findByPk(id, {
    include: [
      {
        model: Room,
        include: [Accommodation]
      },
      {
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name']
      }
    ]
  });
  
  if (!booking) {
    throw new AppError('해당 예약을 찾을 수 없습니다.', 404);
  }
  
  return booking;
};

/**
 * 예약을 취소합니다.
 * 
 * @param {number} id - 예약 ID
 * @returns {Promise<Object>} 취소된 예약 정보
 */
exports.cancelBooking = async (id) => {
  const booking = await Booking.findByPk(id);
  
  if (!booking) {
    throw new AppError('해당 예약을 찾을 수 없습니다.', 404);
  }
  
  if (booking.status === 'cancelled') {
    throw new AppError('이미 취소된 예약입니다.', 400);
  }
  
  // 체크인 날짜 확인 (취소 정책에 따라 조정 가능)
  const checkInDate = new Date(booking.check_in_date);
  const today = new Date();
  const daysDiff = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 1) {
    throw new AppError('체크인 24시간 이내에는 예약을 취소할 수 없습니다.', 400);
  }
  
  // 예약 상태 업데이트
  booking.status = 'cancelled';
  await booking.save();
  
  // 취소 확인 이메일 발송 로직 추가 가능
  
  return booking;
};

/**
 * 사용자의 모든 예약을 조회합니다.
 * 
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 예약 목록
 */
exports.getUserBookings = async (userId) => {
  const bookings = await Booking.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Room,
        include: [Accommodation]
      }
    ],
    order: [['check_in_date', 'DESC']]
  });
  
  return bookings;
};