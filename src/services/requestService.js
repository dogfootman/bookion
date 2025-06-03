const Request = require('../models/request');
const TourInfo = require('../models/TourInfo');
const User = require('../models/User');
//const aiService = require('./aiService');
// const tourApiService = require('./tourApiService');
//const emailService = require('./emailService');
// const smsService = require('./smsService');
const { AppError } = require('../utils/errorHandler');
const { sequelize } = global;

/**
 * 사용자의 여행 정보 요청을 생성하고 처리합니다.
 * 
 * @param {Object} requestData - 요청 데이터
 * @returns {Promise<Object>} 생성된 요청 객체
 */
exports.createRequest = async (requestData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // 요청 생성
    const request = await Request.create(requestData, { transaction });
    
    // 트랜잭션 커밋
    await transaction.commit();
    
    // 비동기로 요청 처리 시작
    processRequest(request.id).catch(err => {
      console.error(`요청 처리 중 오류 (ID: ${request.id}):`, err);
    });
    
    return request;
  } catch (error) {
    // 트랜잭션 롤백
    await transaction.rollback();
    throw error;
  }
};

/**
 * 요청을 비동기적으로 처리합니다.
 * 
 * @param {number} requestId - 요청 ID
 */
const processRequest = async (requestId) => {
  try {
    // 요청 상태 업데이트
    await updateRequestStatus(requestId, 'processing');
    
    // 요청 정보 조회
    const request = await Request.findByPk(requestId);
    
    if (!request) {
      throw new Error(`요청 ID ${requestId}를 찾을 수 없습니다.`);
    }
    
    // AI 분석
    // const analysisResult = await aiService.analyzeRequest(request.request_text);
    
    // 관광 정보 검색
    // const tourInfoList = await tourApiService.searchTourInfo(analysisResult);
    
    // 관광 정보 저장
    // await saveTourInfo(requestId, tourInfoList);
    
    // 응답 메시지 생성
    // const responseMessage = await aiService.generateResponseMessage(tourInfoList, request.request_text);
    
    // 결과 전송
    // await sendRequestResult(request, responseMessage, tourInfoList);
    
    // 요청 상태 업데이트
    await updateRequestStatus(requestId, 'completed');
  } catch (error) {
    console.error(`요청 처리 중 오류 (ID: ${requestId}):`, error);
    await updateRequestStatus(requestId, 'failed');
  }
};

/**
 * 관광 정보를 저장합니다.
 * 
 * @param {number} requestId - 요청 ID
 * @param {Array} tourInfoList - 관광 정보 목록
 */
const saveTourInfo = async (requestId, tourInfoList) => {
  for (const info of tourInfoList) {
    await TourInfo.create({
      request_id: requestId,
      ...info
    });
  }
};

/**
 * 요청 결과를 사용자에게 전송합니다.
 * 
 * @param {Object} request - 요청 정보
 * @param {string} message - 응답 메시지
 * @param {Array} tourInfoList - 관광 정보 목록
 */
const sendRequestResult = async (request, message, tourInfoList) => {
  // 이메일이 있는 경우 이메일 발송
  // if (request.email) {
  //   await emailService.sendEmail({
  //     to: request.email,
  //     subject: '[Bookion] 여행 정보 요청 결과',
  //     html: formatEmailContent(message, tourInfoList)
  //   });
    
  //   // 발송 이력 저장
  //   await saveDeliveryHistory(request.id, 'email', request.email, message);
  // }
  
  // 전화번호가 있는 경우 SMS 발송
  // if (request.phone) {
  //   const smsContent = formatSmsContent(tourInfoList);
  //   await smsService.sendSms(request.phone, smsContent);
    
  //   // 발송 이력 저장
  //   await saveDeliveryHistory(request.id, 'sms', request.phone, smsContent);
  // }
};

/**
 * 이메일 내용을 포맷팅합니다.
 * 
 * @param {string} message - AI가 생성한 메시지
 * @param {Array} tourInfoList - 관광 정보 목록
 * @returns {string} 포맷팅된 HTML 내용
 */
const formatEmailContent = (message, tourInfoList) => {
  let html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">`;
  html += `<h1 style="color: #4a6ee0;">여행 정보 안내</h1>`;
  html += `<div style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>`;
  
  if (tourInfoList && tourInfoList.length > 0) {
    html += `<h2 style="margin-top: 30px; color: #4a6ee0;">추천 장소</h2>`;
    
    tourInfoList.forEach((info, index) => {
      html += `<div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">`;
      html += `<h3 style="color: #333;">${index + 1}. ${info.title}</h3>`;
      
      if (info.image_url) {
        html += `<img src="${info.image_url}" alt="${info.title}" style="max-width: 100%; border-radius: 5px; margin-bottom: 10px;">`;
      }
      
      if (info.content) {
        html += `<p>${info.content.substring(0, 200)}${info.content.length > 200 ? '...' : ''}</p>`;
      }
      
      if (info.address) {
        html += `<p><strong>주소:</strong> ${info.address}</p>`;
      }
      
      html += `</div>`;
    });
  }
  
  html += `<p style="margin-top: 30px; color: #666;">감사합니다.<br>Bookion 여행 정보 서비스</p>`;
  html += `</div>`;
  
  return html;
};

/**
 * SMS 내용을 포맷팅합니다.
 * 
 * @param {Array} tourInfoList - 관광 정보 목록
 * @returns {string} 포맷팅된 SMS 내용
 */
const formatSmsContent = (tourInfoList) => {
  let sms = '[Bookion] 여행 정보가 준비되었습니다.\n';
  
  if (tourInfoList && tourInfoList.length > 0) {
    sms += '추천 장소: ';
    sms += tourInfoList.slice(0, 3).map(info => info.title).join(', ');
    
    if (tourInfoList.length > 3) {
      sms += ' 외 ' + (tourInfoList.length - 3) + '곳';
    }
    
    sms += '\n자세한 내용은 이메일을 확인해주세요.';
  }
  
  return sms;
};

/**
 * 발송 이력을 저장합니다.
 * 
 * @param {number} requestId - 요청 ID
 * @param {string} type - 발송 유형 ('email' 또는 'sms')
 * @param {string} recipient - 수신자
 * @param {string} content - 발송 내용
 */
const saveDeliveryHistory = async (requestId, type, recipient, content) => {
  const Delivery = require('../models/Delivery');
  
  await Delivery.create({
    request_id: requestId,
    delivery_type: type,
    recipient,
    content,
    status: 'sent',
    sent_at: new Date()
  });
};

/**
 * 요청 상태를 업데이트합니다.
 * 
 * @param {number} requestId - 요청 ID
 * @param {string} status - 새로운 상태
 * @returns {Promise<Object>} 업데이트된 요청 객체
 */
exports.updateRequestStatus = async (requestId, status) => {
  const request = await Request.findByPk(requestId);
  
  if (!request) {
    throw new AppError('해당 요청을 찾을 수 없습니다.', 404);
  }
  
  request.status = status;
  await request.save();
  
  return request;
};

/**
 * 특정 요청의 상세 정보를 조회합니다.
 * 
 * @param {number} id - 요청 ID
 * @returns {Promise<Object>} 요청 정보
 */
exports.getRequestById = async (id) => {
  const request = await Request.findByPk(id, {
    include: [
      {
        model: TourInfo
      },
      {
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name']
      }
    ]
  });
  
  if (!request) {
    throw new AppError('해당 요청을 찾을 수 없습니다.', 404);
  }
  
  return request;
};

/**
 * 모든 요청 목록을 조회합니다.
 * 
 * @param {Object} query - 쿼리 파라미터
 * @returns {Promise<Array>} 요청 목록
 */
exports.getAllRequests = async (query) => {
  const { status, page = 1, limit = 10 } = query;
  
  const options = {
    include: [
      {
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name']
      }
    ],
    order: [['created_at', 'DESC']],
    offset: (page - 1) * limit,
    limit: parseInt(limit)
  };
  
  if (status) {
    options.where = { status };
  }
  
  const requests = await Request.findAll(options);
  
  return requests;
};