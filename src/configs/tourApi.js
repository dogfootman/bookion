const { TOUR_API } = require('./constants');

/**
 * Tour API 설정
 */
const TOUR_API_CONFIG = {
  // API 기본 설정
  baseUrl: 'https://apis.data.go.kr/B551011/KorService2',
  serviceKey: TOUR_API.KEY,
  
  // API 엔드포인트
  endpoints: {
    areaCode: '/areaCode2',
    categoryCode: '/categoryCode2',
    lclsSystmCode: '/lclsSystmCode2',
    areaBasedList: '/areaBasedList1'
  },
  
  // API 요청 기본 파라미터
  defaultParams: {
    MobileOS: 'ETC',
    MobileApp: 'bookion',
    _type: 'json',
    numOfRows: '99',
    pageNo: '1'
  },
  
  // API 응답 코드
  responseCodes: {
    SUCCESS: '0000'
  },
  
  // 동기화 설정
  sync: {
    maxRetries: 3,
    retryDelay: 1000, // 1초
    batchSize: 100
  }
};

module.exports = {
  TOUR_API_CONFIG
}; 