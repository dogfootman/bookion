const bookingService = require('../services/bookingService');
const { catchAsync } = require('../utils/errorHandler');

/**
 * 새로운 예약을 생성합니다.
 * Swagger operationId: createBooking
 */
exports.createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { booking },
    message: '예약이 성공적으로 생성되었습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 예약 정보를 조회합니다.
 * Swagger operationId: getBookingById
 */
exports.getBookingById = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { booking },
    message: '예약 정보 조회에 성공했습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 예약을 취소합니다.
 * Swagger operationId: cancelBooking
 */
exports.cancelBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { booking },
    message: '예약이 성공적으로 취소되었습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 사용자의 모든 예약을 조회합니다.
 * Swagger operationId: getUserBookings
 */
exports.getUserBookings = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const bookings = await bookingService.getUserBookings(userId);
  
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings },
    message: '사용자 예약 목록 조회에 성공했습니다.',
    timestamp: new Date().toISOString()
  });
});