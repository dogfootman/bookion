require('dotenv').config();

// 환경 변수 로깅
console.log('Environment Variables Check:');
console.log('TOUR_API_KEY exists:', !!process.env.TOUR_API_KEY);
console.log('TOUR_API_KEY length:', process.env.TOUR_API_KEY ? process.env.TOUR_API_KEY.length : 0);
console.log('TOUR_API_KEY first 10 chars:', process.env.TOUR_API_KEY ? process.env.TOUR_API_KEY.substring(0, 10) + '...' : 'undefined');

/**
 * Tour API 관련 상수
 */
const TOUR_API = {
  BASE_URL: 'http://apis.data.go.kr/B551011/KorService2',
  KEY: process.env.TOUR_API_KEY,
  MOBILE_OS: 'ETC',
  MOBILE_APP: 'Bookion',
  RESPONSE_TYPE: 'json'
};

// TOUR_API 객체 로깅
console.log('TOUR_API Configuration:');
console.log('BASE_URL:', TOUR_API.BASE_URL);
console.log('KEY exists:', !!TOUR_API.KEY);
console.log('KEY length:', TOUR_API.KEY ? TOUR_API.KEY.length : 0);
console.log('KEY first 10 chars:', TOUR_API.KEY ? TOUR_API.KEY.substring(0, 10) + '...' : 'undefined');

/**
 * API 응답 상태 코드
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

/**
 * API 응답 메시지
 */
const API_MESSAGES = {
  SUCCESS: 'Success',
  INVALID_API_KEY: 'Invalid API key',
  INVALID_PARAMETERS: 'Invalid parameters',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Internal server error'
};

module.exports = {
  TOUR_API,
  HTTP_STATUS,
  API_MESSAGES,
  TOUR_API_KEY: TOUR_API.KEY,
  TOUR_API_BASE_URL: TOUR_API.BASE_URL
}; 