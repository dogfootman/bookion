/**
 * API Secret Key 검증 미들웨어
 * 프론트엔드에서 전달받은 API Secret Key의 유효성을 검증합니다.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const validateApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  const serverApiKey = process.env.API_SECRET_KEY;

  if (!serverApiKey) {
    console.error('API_SECRET_KEY is not set in environment variables');
    return res.status(500).json({
      status: 'error',
      message: '서버 설정 오류가 발생했습니다.'
    });
  }

  if (!clientApiKey) {
    return res.status(401).json({
      status: 'fail',
      message: 'API 키가 필요합니다.'
    });
  }

  if (clientApiKey !== serverApiKey) {
    return res.status(401).json({
      status: 'fail',
      message: '유효하지 않은 API 키입니다.'
    });
  }

  next();
};

module.exports = {
  validateApiKey
}; 