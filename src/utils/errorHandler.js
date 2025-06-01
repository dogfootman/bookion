const winston = require('winston');
const path = require('path');

// 로거 초기화
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'bookion-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// 프로덕션 환경에서만 파일 로깅 추가
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({ 
    filename: path.join('logs', 'error.log'), 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: path.join('logs', 'combined.log') 
  }));
}

/**
 * 애플리케이션 전용 에러 클래스
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 비동기 컨트롤러 함수에서 발생하는 에러를 처리하는 유틸리티
 * 
 * @param {Function} fn - 비동기 컨트롤러 함수
 * @returns {Function} 에러 처리가 적용된 함수
 */
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * 글로벌 에러 핸들러
 * 
 * @param {Error} err - 발생한 에러
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // 에러 로깅
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  // 개발 환경에서는 상세 오류 정보 제공
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
      timestamp: new Date().toISOString()
    });
  } 
  // 프로덕션 환경에서는 간소화된 오류 메시지 제공
  else {
    // 운영상의 에러는 일반 메시지로 대체
    if (!err.isOperational) {
      err.message = '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.';
    }
    
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  AppError,
  catchAsync,
  errorHandler,
  logger
};