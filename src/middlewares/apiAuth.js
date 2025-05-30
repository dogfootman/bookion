const ApiKey = require('../models/apiKey');
const { AppError } = require('../utils/errorHandler');

/**
 * API 키 인증 미들웨어
 * HTTP 헤더에서 x-api-key를 확인하여 유효한 API 키인지 검증합니다.
 * 
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
exports.authenticateApiKey = async (req, res, next) => {
  try {
    // 개발 환경에서는 인증을 건너뛸 수 있는 옵션 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_API_AUTH === 'true') {
      req.client = {
        id: 0,
        name: 'Development',
        rateLimit: 1000
      };
      return next();
    }
    
    // 헤더에서 API 키 추출
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return next(new AppError('API 키가 필요합니다. 요청 헤더에 x-api-key를 포함해주세요.', 401));
    }
    
    // API 키 조회
    const keyData = await ApiKey.findOne({
      where: {
        api_key: apiKey,
        is_active: true
      }
    });
    
    if (!keyData) {
      return next(new AppError('유효하지 않은 API 키입니다.', 401));
    }
    
    // 만료 여부 확인
    if (new Date() > new Date(keyData.expires_at)) {
      return next(new AppError('만료된 API 키입니다.', 401));
    }
    
    // IP 제한 확인 (허용된 IP가 설정된 경우)
    if (keyData.allowed_ips) {
      const clientIp = req.ip || req.connection.remoteAddress;
      const allowedIps = keyData.allowed_ips.split(',').map(ip => ip.trim());
      
      if (!allowedIps.includes(clientIp) && !allowedIps.includes('*')) {
        return next(new AppError('이 IP 주소에서는 API에 접근할 수 없습니다.', 403));
      }
    }
    
    // API 키 사용 기록 업데이트
    await keyData.update({
      last_used_at: new Date()
    });
    
    // 요청 객체에 클라이언트 정보 추가
    req.client = {
      id: keyData.id,
      name: keyData.client_name,
      rateLimit: keyData.rate_limit
    };
    
    next();
  } catch (error) {
    console.error('API 키 인증 중 오류:', error);
    next(new AppError('인증 처리 중 오류가 발생했습니다.', 500));
  }
};

/**
 * 관리자 인증 미들웨어
 * API 키 관리 등 관리자 전용 기능에 접근하기 위한 인증을 처리합니다.
 * 
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
exports.authenticateAdmin = async (req, res, next) => {
  try {
    // 개발 환경에서는 인증을 건너뛸 수 있는 옵션 (선택사항)
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_ADMIN_AUTH === 'true') {
      req.admin = {
        id: 0,
        name: 'Admin'
      };
      return next();
    }
    
    // 헤더에서 Authorization 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('관리자 인증이 필요합니다. Bearer 토큰을 제공해주세요.', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // 여기서는 간단한 예시로 환경 변수에 설정된 관리자 토큰과 비교
    // 실제로는 JWT 검증 등 더 안전한 방법을 사용해야 함
    if (token !== process.env.ADMIN_API_TOKEN) {
      return next(new AppError('유효하지 않은 관리자 토큰입니다.', 401));
    }
    
    // 요청 객체에 관리자 정보 추가
    req.admin = {
      id: 1,
      name: 'Admin'
    };
    
    next();
  } catch (error) {
    console.error('관리자 인증 중 오류:', error);
    next(new AppError('인증 처리 중 오류가 발생했습니다.', 500));
  }
};

/**
 * API 키 검증 미들웨어
 * 특정 API 키가 유효한지 검증합니다 (API 키 관리 기능에서 사용).
 * 
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
exports.validateApiKey = async (req, res, next) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return next(new AppError('API 키가 필요합니다.', 400));
    }
    
    const keyData = await ApiKey.findOne({
      where: {
        api_key: apiKey
      }
    });
    
    if (!keyData) {
      return next(new AppError('유효하지 않은 API 키입니다.', 404));
    }
    
    // 요청 객체에 API 키 정보 추가
    req.apiKeyData = keyData;
    
    next();
  } catch (error) {
    console.error('API 키 검증 중 오류:', error);
    next(new AppError('API 키 검증 중 오류가 발생했습니다.', 500));
  }
};
