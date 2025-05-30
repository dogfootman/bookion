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
    errorHandler
  };