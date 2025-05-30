const axios = require('axios');
const { TOUR_API_KEY } = process.env;

/**
 * Get location-based tour information
 * 위치 기반 관광 정보를 조회합니다.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getLocationBasedTours = async (req, res, next) => {
  try {
    const { 
      mapX, 
      mapY, 
      radius = 10000, 
      contentTypeId,
      pageNo = 1,
      numOfRows = 10
    } = req.query;

    // 필수 파라미터 검증
    if (!mapX || !mapY) {
      return res.status(400).json({
        status: 'fail',
        message: 'mapX와 mapY는 필수 파라미터입니다.'
      });
    }

    // API 호출 파라미터 설정
    const params = {
      serviceKey: TOUR_API_KEY,
      numOfRows,
      pageNo,
      MobileOS: 'ETC',
      MobileApp: 'AppTest',
      _type: 'json',
      arrange: 'C',
      mapX,
      mapY,
      radius,
      contentTypeId,
      lDongRegnCd: '11',
      lDongSignguCd: '140',
      areaCode: '1'
    };

    // 쿼리 파라미터 문자열 생성 (serviceKey는 이미 인코딩되어 있으므로 제외)
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        if (key === 'serviceKey') {
          return `${key}=${value}`;
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // API URL 생성
    const apiUrl = `https://apis.data.go.kr/B551011/EngService2/locationBasedList2?${queryString}`;

    // API 호출 정보 로깅
    console.log('Tour API Call:');
    console.log('URL:', apiUrl);

    // Tour API 호출
    const response = await axios.get(apiUrl);

    // API 응답 로깅
    console.log('Tour API Response:', JSON.stringify(response.data, null, 2));

    // API 응답 데이터 구조 확인
    if (!response.data) {
      console.error('Empty API response');
      return res.status(500).json({
        status: 'error',
        message: 'Tour API 응답이 비어있습니다.'
      });
    }

    // 응답 데이터 가공
    const tourData = response.data.response?.body?.items?.item || [];
    const totalCount = response.data.response?.body?.totalCount || 0;
    const currentPage = parseInt(pageNo);
    const itemsPerPage = parseInt(numOfRows);

    res.status(200).json({
      status: 'success',
      data: {
        items: Array.isArray(tourData) ? tourData : [tourData],
        pagination: {
          currentPage,
          itemsPerPage,
          totalItems: parseInt(totalCount),
          totalPages: Math.ceil(parseInt(totalCount) / itemsPerPage)
        }
      }
    });
  } catch (error) {
    console.error('Tour API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    next(error);
  }
};

/**
 * Get all location-based tour information
 * 위치 기반의 모든 관광 정보를 페이지네이션을 통해 조회합니다.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getAllLocationBasedTours = async (req, res, next) => {
  try {
    const { 
      mapX, 
      mapY, 
      radius = 10000,
      numOfRows = 10
    } = req.query;

    // 필수 파라미터 검증
    if (!mapX || !mapY) {
      return res.status(400).json({
        status: 'fail',
        message: 'mapX와 mapY는 필수 파라미터입니다.'
      });
    }

    // 첫 페이지 데이터 조회
    const firstPageParams = {
      serviceKey: TOUR_API_KEY,
      numOfRows,
      pageNo: 1,
      MobileOS: 'ETC',
      MobileApp: 'AppTest',
      _type: 'json',
      arrange: 'C',
      mapX,
      mapY,
      radius,
      lDongRegnCd: '11',
      lDongSignguCd: '140',
      areaCode: '1'
    };

    // 첫 페이지 쿼리 문자열 생성
    const firstPageQueryString = Object.entries(firstPageParams)
      .map(([key, value]) => {
        if (key === 'serviceKey') {
          return `${key}=${value}`;
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // 첫 페이지 API URL
    const firstPageUrl = `https://apis.data.go.kr/B551011/EngService2/locationBasedList2?${firstPageQueryString}`;

    // 첫 페이지 API 호출
    const firstPageResponse = await axios.get(firstPageUrl);
    const totalCount = firstPageResponse.data.response?.body?.totalCount || 0;
    const totalPages = Math.ceil(parseInt(totalCount) / parseInt(numOfRows));

    // 모든 데이터를 저장할 배열
    let allTourData = firstPageResponse.data.response?.body?.items?.item || [];
    allTourData = Array.isArray(allTourData) ? allTourData : [allTourData];

    // 나머지 페이지 데이터 조회
    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const remainingPagesData = await Promise.all(
      remainingPages.map(async (pageNo) => {
        const params = {
          ...firstPageParams,
          pageNo
        };

        const queryString = Object.entries(params)
          .map(([key, value]) => {
            if (key === 'serviceKey') {
              return `${key}=${value}`;
            }
            return `${key}=${encodeURIComponent(value)}`;
          })
          .join('&');

        const apiUrl = `https://apis.data.go.kr/B551011/EngService2/locationBasedList2?${queryString}`;
        const response = await axios.get(apiUrl);
        const pageData = response.data.response?.body?.items?.item || [];
        return Array.isArray(pageData) ? pageData : [pageData];
      })
    );

    // 모든 페이지 데이터 합치기
    allTourData = allTourData.concat(...remainingPagesData);

    res.status(200).json({
      status: 'success',
      data: {
        items: allTourData,
        pagination: {
          totalItems: parseInt(totalCount),
          itemsPerPage: parseInt(numOfRows),
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Tour API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    next(error);
  }
};

/**
 * Get tour detail images
 * 관광지의 상세 이미지를 조회합니다.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getTourDetailImages = async (req, res, next) => {
  try {
    const { 
      contentId,
      pageNo = 1,
      numOfRows = 10
    } = req.query;

    // 필수 파라미터 검증
    if (!contentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'contentId는 필수 파라미터입니다.'
      });
    }

    // API 호출 파라미터 설정
    const params = {
      serviceKey: TOUR_API_KEY,
      numOfRows,
      pageNo,
      MobileOS: 'ETC',
      MobileApp: 'book',
      _type: 'json',
      contentId
    };

    // 쿼리 파라미터 문자열 생성 (serviceKey는 이미 인코딩되어 있으므로 제외)
    const queryString = Object.entries(params)
      .map(([key, value]) => {
        if (key === 'serviceKey') {
          return `${key}=${value}`;
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // API URL 생성
    const apiUrl = `https://apis.data.go.kr/B551011/EngService2/detailImage2?${queryString}`;

    // API 호출 정보 로깅
    console.log('Tour Detail Image API Call:');
    console.log('URL:', apiUrl);

    // Tour API 호출
    const response = await axios.get(apiUrl);

    // API 응답 로깅
    console.log('Tour Detail Image API Response:', JSON.stringify(response.data, null, 2));

    // API 응답 데이터 구조 확인
    if (!response.data || !response.data.response) {
      console.error('Invalid API response structure');
      return res.status(500).json({
        status: 'error',
        message: 'Tour API 응답 구조가 올바르지 않습니다.'
      });
    }

    // API 응답 상태 확인
    const { resultCode, resultMsg } = response.data.response.header;
    if (resultCode !== '0000') {
      return res.status(500).json({
        status: 'error',
        message: `Tour API 오류: ${resultMsg}`
      });
    }

    // 응답 데이터 그대로 반환
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Tour Detail Image API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    next(error);
  }
};

/**
 * Get all tour detail images
 * 관광지의 모든 상세 이미지를 페이지네이션을 통해 조회합니다.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
const getAllTourDetailImages = async (req, res, next) => {
  try {
    const { 
      contentId,
      numOfRows = 10
    } = req.query;

    // 필수 파라미터 검증
    if (!contentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'contentId는 필수 파라미터입니다.'
      });
    }

    // 첫 페이지 데이터 조회
    const firstPageParams = {
      serviceKey: TOUR_API_KEY,
      numOfRows,
      pageNo: 1,
      MobileOS: 'ETC',
      MobileApp: 'book',
      _type: 'json',
      contentId
    };

    // 첫 페이지 쿼리 문자열 생성
    const firstPageQueryString = Object.entries(firstPageParams)
      .map(([key, value]) => {
        if (key === 'serviceKey') {
          return `${key}=${value}`;
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // 첫 페이지 API URL
    const firstPageUrl = `https://apis.data.go.kr/B551011/EngService2/detailImage2?${firstPageQueryString}`;

    // 첫 페이지 API 호출
    const firstPageResponse = await axios.get(firstPageUrl);

    // API 응답 데이터 구조 확인
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure');
      return res.status(500).json({
        status: 'error',
        message: 'Tour API 응답 구조가 올바르지 않습니다.'
      });
    }

    // API 응답 상태 확인
    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== '0000') {
      return res.status(500).json({
        status: 'error',
        message: `Tour API 오류: ${resultMsg}`
      });
    }

    const totalCount = firstPageResponse.data.response.body.totalCount || 0;
    const totalPages = Math.ceil(parseInt(totalCount) / parseInt(numOfRows));

    // 모든 데이터를 저장할 배열
    let allImageData = firstPageResponse.data.response.body.items.item || [];
    allImageData = Array.isArray(allImageData) ? allImageData : [allImageData];

    // 나머지 페이지 데이터 조회
    const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const remainingPagesData = await Promise.all(
      remainingPages.map(async (pageNo) => {
        const params = {
          ...firstPageParams,
          pageNo
        };

        const queryString = Object.entries(params)
          .map(([key, value]) => {
            if (key === 'serviceKey') {
              return `${key}=${value}`;
            }
            return `${key}=${encodeURIComponent(value)}`;
          })
          .join('&');

        const apiUrl = `https://apis.data.go.kr/B551011/EngService2/detailImage2?${queryString}`;
        const response = await axios.get(apiUrl);
        const pageData = response.data.response.body.items.item || [];
        return Array.isArray(pageData) ? pageData : [pageData];
      })
    );

    // 모든 페이지 데이터 합치기
    allImageData = allImageData.concat(...remainingPagesData);

    // 응답 데이터 구성
    const response = {
      response: {
        header: {
          resultCode: '0000',
          resultMsg: 'OK'
        },
        body: {
          items: {
            item: allImageData
          },
          numOfRows: parseInt(numOfRows),
          pageNo: 1,
          totalCount: parseInt(totalCount)
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Tour Detail Image API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', error.response.data);
    }
    next(error);
  }
};

module.exports = {
  getLocationBasedTours,
  getAllLocationBasedTours,
  getTourDetailImages,
  getAllTourDetailImages
}; 