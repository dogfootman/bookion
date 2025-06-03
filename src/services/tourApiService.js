const axios = require('axios');
const { TOUR_API } = require('../configs/constants');
const TOUR_API_CONFIG = require('../configs/tourApi');
const { SyncLog, TouristSpot, AreaCode, SigunguCode, CategoryCode, LclsSystmCode } = require('../models');
const getModels = require('../models/tour/index');
const { AppError } = require('../utils/errorHandler');
const { createSyncLog, updateSyncLog } = require('./syncLogService');
const logger = require('../utils/logger');
const { sequelize } = global;

// 설정 로드 확인
console.log('TourApiService - Configuration Check:', {
  baseUrl: TOUR_API_CONFIG.baseUrl,
  endpoints: TOUR_API_CONFIG.endpoints,
  defaultParams: TOUR_API_CONFIG.defaultParams,
  serviceKey: TOUR_API_CONFIG.serviceKey ? 'exists' : 'missing'
});

// Tour API 클라이언트 정의
const tourApiClient = {
  async getLclsSystmCodes() {
    const baseUrl = `${TOUR_API_CONFIG.baseUrl}${TOUR_API_CONFIG.endpoints.lclsSystmCode}`;
    const queryParams = {
      ...TOUR_API_CONFIG.defaultParams,
      lclsSystmListYn: 'Y'
    };

    const url = `${baseUrl}?${new URLSearchParams(queryParams)}&serviceKey=${TOUR_API_CONFIG.serviceKey}`;
    console.log('TourApiClient - API URL:', url);
    const response = await axios.get(url);
    return response.data;
  }
};

// 디버그 로깅 추가
console.log('TourApiService - Model initialization check:');
console.log('- LclsSystmCode:', {
  exists: !!LclsSystmCode,
  hasInit: !!LclsSystmCode?.init,
  hasUpsert: !!LclsSystmCode?.upsert,
  prototype: Object.getPrototypeOf(LclsSystmCode || {})
});

/**
 * Tour API에서 지역 코드를 가져와 데이터베이스에 저장
 * @returns {Promise<Object>} 동기화 결과
 */
const fetchAreaCodes = async () => {
  const syncLog = await SyncLog.create({
    api_name: 'areaCode2',
    total_count: 0,
    status: 'success',
    started_at: new Date()
  });

  try {
    console.log('Starting area code synchronization...');
    
    // API URL과 쿼리 파라미터 구성
    const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/areaCode2';
    
    // 서비스 키는 이미 인코딩되어 있으므로 decodeURIComponent로 디코딩 후 사용
    const decodedServiceKey = decodeURIComponent(TOUR_API.KEY);
    
    // 첫 페이지 요청으로 전체 데이터 수 확인
    const firstPageParams = new URLSearchParams({
      numOfRows: '99',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'bookion',
      _type: 'json',
      serviceKey: decodedServiceKey
    });
    
    const firstPageUrl = `${baseUrl}?${firstPageParams.toString()}`;
    console.log('First page API URL:', firstPageUrl);
    
    const firstPageResponse = await axios.get(firstPageUrl);
    
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure:', firstPageResponse.data);
      throw new AppError('Tour API 응답 구조가 올바르지 않습니다.', 500);
    }

    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== '0000') {
      console.error('API Error:', { resultCode, resultMsg });
      throw new AppError(`Tour API 오류: ${resultMsg}`, 500);
    }

    const totalCount = firstPageResponse.data.response.body.totalCount;
    console.log('Total area codes to fetch:', totalCount);

    // sync_log 업데이트
    await syncLog.update({ total_count: totalCount });

    // 모든 데이터를 저장할 배열
    let allAreaCodes = firstPageResponse.data.response.body.items.item;
    allAreaCodes = Array.isArray(allAreaCodes) ? allAreaCodes : [allAreaCodes];

    // 나머지 페이지 데이터 가져오기
    const numOfRows = 99;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    if (totalPages > 1) {
      console.log(`Fetching remaining ${totalPages - 1} pages...`);
      
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (const pageNo of remainingPages) {
        console.log(`Fetching page ${pageNo}...`);
        
        const pageParams = new URLSearchParams({
          numOfRows: numOfRows.toString(),
          pageNo: pageNo.toString(),
          MobileOS: 'ETC',
          MobileApp: 'bookion',
          _type: 'json',
          serviceKey: decodedServiceKey
        });
        
        const pageUrl = `${baseUrl}?${pageParams.toString()}`;
        const pageResponse = await axios.get(pageUrl);
        
        if (!pageResponse.data || !pageResponse.data.response) {
          console.error(`Invalid API response structure for page ${pageNo}:`, pageResponse.data);
          continue;
        }

        const pageItems = pageResponse.data.response.body.items.item;
        const pageAreaCodes = Array.isArray(pageItems) ? pageItems : [pageItems];
        allAreaCodes = allAreaCodes.concat(pageAreaCodes);
        
        console.log(`Page ${pageNo} fetched: ${pageAreaCodes.length} items`);
      }
    }

    console.log(`Total area codes fetched: ${allAreaCodes.length}`);

    // 데이터 동기화 (upsert)
    console.log('Synchronizing area codes...');
    const syncResults = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0
    };

    for (const areaCode of allAreaCodes) {
      try {
        const [instance, created] = await AreaCode.upsert({
          code: areaCode.code,
          name: areaCode.name
        }, {
          returning: true
        });

        if (created) {
          syncResults.created++;
        } else {
          // updated_at 필드가 변경되었는지 확인
          const isChanged = instance.updatedAt > instance.createdAt;
          if (isChanged) {
            syncResults.updated++;
          } else {
            syncResults.unchanged++;
          }
        }
      } catch (error) {
        console.error(`Error upserting area code ${areaCode.code}:`, error);
        syncResults.errors++;
      }
    }

    console.log('Area codes synchronization completed:', syncResults);

    // 최종 결과 조회
    const finalCount = await AreaCode.count();
    console.log(`Final area codes count in database: ${finalCount}`);

    // sync_log 업데이트
    await syncLog.update({
      created_count: syncResults.created,
      updated_count: syncResults.updated,
      unchanged_count: syncResults.unchanged,
      error_count: syncResults.errors,
      completed_at: new Date()
    });

    return {
      syncResults,
      totalCount: finalCount,
      syncLog
    };
  } catch (error) {
    console.error('Error in fetchAreaCodes:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    // sync_log 업데이트
    await syncLog.update({
      status: 'error',
      error_message: error.message,
      completed_at: new Date()
    });

    throw new AppError('지역 코드 동기화 중 오류가 발생했습니다.', 500);
  }
};

/**
 * Tour API에서 카테고리 코드를 가져와 데이터베이스에 저장
 * @param {Object} [options] - 카테고리 코드 조회 옵션
 * @param {string} [options.cat1] - 대분류 코드
 * @param {string} [options.cat2] - 중분류 코드
 * @returns {Promise<Object>} 동기화 결과
 */
const fetchCategoryCodes = async (options = {}) => {
  const syncLog = await SyncLog.create({
    api_name: 'categoryCode2',
    total_count: 0,
    status: 'success',
    started_at: new Date()
  });

  try {
    console.log('Starting category code synchronization...');
    
    // API URL과 쿼리 파라미터 구성
    const baseUrl = 'http://apis.data.go.kr/B551011/KorService2/categoryCode2';
    const decodedServiceKey = decodeURIComponent(TOUR_API.KEY);
    
    // 기본 파라미터
    const baseParams = {
      numOfRows: '99',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'bookion',
      _type: 'json',
      serviceKey: decodedServiceKey
    };

    // 옵션에 따라 파라미터 추가
    if (options.cat1) baseParams.cat1 = options.cat1;
    if (options.cat2) baseParams.cat2 = options.cat2;

    console.log('API parameters:', baseParams);
    
    // 첫 페이지 요청으로 전체 데이터 수 확인
    const firstPageParams = new URLSearchParams(baseParams);
    const firstPageUrl = `${baseUrl}?${firstPageParams.toString()}`;
    console.log('First page API URL:', firstPageUrl);
    
    const firstPageResponse = await axios.get(firstPageUrl);
    
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure:', firstPageResponse.data);
      throw new AppError('Tour API 응답 구조가 올바르지 않습니다.', 500);
    }

    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== '0000') {
      console.error('API Error:', { resultCode, resultMsg });
      throw new AppError(`Tour API 오류: ${resultMsg}`, 500);
    }

    const totalCount = firstPageResponse.data.response.body.totalCount;
    console.log('Total category codes to fetch:', totalCount);

    // sync_log 업데이트
    await syncLog.update({ total_count: totalCount });

    // 모든 데이터를 저장할 배열
    let allCategoryCodes = firstPageResponse.data.response.body.items.item;
    if (!allCategoryCodes) {
      console.log('No category codes found in response');
      return {
        syncResults: { created: 0, updated: 0, unchanged: 0, errors: 0 },
        totalCount: 0,
        syncLog,
        categoryCodes: []
      };
    }
    allCategoryCodes = Array.isArray(allCategoryCodes) ? allCategoryCodes : [allCategoryCodes];

    // 나머지 페이지 데이터 가져오기
    const numOfRows = 99;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    if (totalPages > 1) {
      console.log(`Fetching remaining ${totalPages - 1} pages...`);
      
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (const pageNo of remainingPages) {
        console.log(`Fetching page ${pageNo}...`);
        
        const pageParams = new URLSearchParams({
          ...baseParams,
          pageNo: pageNo.toString()
        });
        
        const pageUrl = `${baseUrl}?${pageParams.toString()}`;
        const pageResponse = await axios.get(pageUrl);
        
        if (!pageResponse.data || !pageResponse.data.response) {
          console.error(`Invalid API response structure for page ${pageNo}:`, pageResponse.data);
          continue;
        }

        const pageItems = pageResponse.data.response.body.items.item;
        if (pageItems) {
          const pageCategoryCodes = Array.isArray(pageItems) ? pageItems : [pageItems];
          allCategoryCodes = allCategoryCodes.concat(pageCategoryCodes);
          console.log(`Page ${pageNo} fetched: ${pageCategoryCodes.length} items`);
        }
      }
    }

    console.log(`Total category codes fetched: ${allCategoryCodes.length}`);

    // 데이터 동기화 (upsert)
    console.log('Synchronizing category codes...');
    const syncResults = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0
    };

    for (const categoryCode of allCategoryCodes) {
      try {
        // level 계산
        const getLevel = (options) => {
          if (!options.cat1) return 1;
          if (!options.cat2) return 2;
          return 3;
        };
        // 카테고리 코드 저장
        const [instance, created] = await CategoryCode.upsert({
          code: categoryCode.code,
          name: categoryCode.name,
          rnum: categoryCode.rnum,
          cat1: options.cat1 || null,
          cat2: options.cat2 || null,
          cat3: null,
          parentCode: options.cat2 || options.cat1 || null,
          level: getLevel(options)
        }, {
          returning: true
        });

        if (created) {
          syncResults.created++;
        } else {
          const isChanged = instance.updatedAt > instance.createdAt;
          if (isChanged) {
            syncResults.updated++;
          } else {
            syncResults.unchanged++;
          }
        }

        // 하위 카테고리 조회
        if (!options.cat1) {
          // cat1 조회
          console.log(`Fetching cat1 for ${categoryCode.code} (${categoryCode.name})`);
          await fetchCategoryCodes({
            cat1: categoryCode.code
          });
        } else if (!options.cat2) {
          // cat2 조회
          console.log(`Fetching cat2 for ${categoryCode.code} (${categoryCode.name})`);
          await fetchCategoryCodes({
            cat1: options.cat1,
            cat2: categoryCode.code
          });
        } else {
          // cat3은 최하위 레벨이므로 더 이상 하위 카테고리 조회하지 않음
          console.log(`Reached leaf category: ${categoryCode.code} (${categoryCode.name})`);
        }
      } catch (error) {
        console.error(`Error upserting category code ${categoryCode.code}:`, error);
        syncResults.errors++;
      }
    }

    console.log('Category codes synchronization completed:', syncResults);

    // 최종 결과 조회
    const finalCount = await CategoryCode.count();
    console.log(`Final category codes count in database: ${finalCount}`);

    // sync_log 업데이트
    await syncLog.update({
      created_count: syncResults.created,
      updated_count: syncResults.updated,
      unchanged_count: syncResults.unchanged,
      error_count: syncResults.errors,
      completed_at: new Date()
    });

    return {
      syncResults,
      totalCount: finalCount,
      syncLog,
      categoryCodes: allCategoryCodes
    };
  } catch (error) {
    console.error('Error in fetchCategoryCodes:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    // sync_log 업데이트
    await syncLog.update({
      status: 'error',
      error_message: error.message,
      completed_at: new Date()
    });

    throw new AppError('카테고리 코드 동기화 중 오류가 발생했습니다.', 500);
  }
};

/**
 * 카테고리 코드를 재귀적으로 동기화
 * @param {string} [parentCode=null] - 상위 카테고리 코드
 * @param {number} [level=1] - 현재 카테고리 레벨
 * @param {number} [maxLevel=4] - 최대 카테고리 레벨
 * @returns {Promise<Object>} 동기화 결과
 */
const syncCategoryCodesRecursively = async (parentCode = null, level = 1, maxLevel = 4) => {
  // 최대 레벨 제한 확인
  if (level > maxLevel) {
    console.log(`Reached maximum level ${maxLevel}, stopping recursion`);
    return;
  }

  console.log(`Starting category code synchronization for level ${level} with parent code ${parentCode || 'NULL'}...`);

  try {
    // 현재 레벨의 카테고리 코드 가져오기
    const result = await fetchCategoryCodes({
      level,
      parentCode
    });

    const categories = result.categoryCodes;
    console.log(`Found ${categories.length} categories for level ${level}`);

    // 각 카테고리에 대해 재귀적으로 하위 카테고리 동기화
    for (const category of categories) {
      console.log(`Processing category: ${category.code} (${category.name}) at level ${level}`);
      
      // 다음 레벨의 카테고리 동기화
      if (level < maxLevel) {
        console.log(`Recursively fetching level ${level + 1} categories for parent ${category.code}`);
        await syncCategoryCodesRecursively(category.code, level + 1, maxLevel);
      }
    }

    return result;
  } catch (error) {
    console.error(`Error in syncCategoryCodesRecursively for level ${level}:`, error);
    throw error;
  }
};

/**
 * 모든 카테고리 코드를 계층적으로 동기화
 * @returns {Promise<Object>} 동기화 결과
 */
const syncAllCategoryCodes = async () => {
  try {
    console.log('Starting complete category code synchronization...');
    
    // 레벨 1부터 시작하여 재귀적으로 모든 카테고리 동기화
    const result = await syncCategoryCodesRecursively(null, 1, 4);
    console.log('Category code synchronization completed successfully');

    return {
      message: '모든 카테고리 코드 동기화가 완료되었습니다.',
      status: 'success',
      result
    };
  } catch (error) {
    console.error('Error in syncAllCategoryCodes:', error);
    throw new AppError('카테고리 코드 동기화 중 오류가 발생했습니다.', 500);
  }
};

/**
 * 특정 지역의 관광지 정보를 가져와 데이터베이스에 저장
 * @param {number} areaCode - 지역 코드
 * @returns {Promise<Object>} 동기화 결과
 */
const fetchTouristSpotsByArea = async (areaCode) => {
  const syncLog = await SyncLog.create({
    api_name: 'areaBasedList1',
    total_count: 0,
    status: 'success',
    started_at: new Date()
  });

  try {
    console.log(`Starting tourist spots synchronization for area code ${areaCode}...`);
    
    // API URL과 쿼리 파라미터 구성
    const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList1';
    const decodedServiceKey = decodeURIComponent(TOUR_API.KEY);
    
    // 첫 페이지 요청으로 전체 데이터 수 확인
    const firstPageParams = new URLSearchParams({
      numOfRows: '99',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'bookion',
      _type: 'json',
      serviceKey: decodedServiceKey,
      areaCode: areaCode.toString()
    });
    
    const firstPageUrl = `${baseUrl}?${firstPageParams.toString()}`;
    console.log('First page API URL:', firstPageUrl);
    
    const firstPageResponse = await axios.get(firstPageUrl);
    
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure:', firstPageResponse.data);
      throw new AppError('Tour API 응답 구조가 올바르지 않습니다.', 500);
    }

    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== '0000') {
      console.error('API Error:', { resultCode, resultMsg });
      throw new AppError(`Tour API 오류: ${resultMsg}`, 500);
    }

    const totalCount = firstPageResponse.data.response.body.totalCount;
    console.log('Total tourist spots to fetch:', totalCount);

    // sync_log 업데이트
    await syncLog.update({ total_count: totalCount });

    // 모든 데이터를 저장할 배열
    let allTouristSpots = firstPageResponse.data.response.body.items.item;
    allTouristSpots = Array.isArray(allTouristSpots) ? allTouristSpots : [allTouristSpots];

    // 나머지 페이지 데이터 가져오기
    const numOfRows = 99;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    if (totalPages > 1) {
      console.log(`Fetching remaining ${totalPages - 1} pages...`);
      
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (const pageNo of remainingPages) {
        console.log(`Fetching page ${pageNo}...`);
        
        const pageParams = new URLSearchParams({
          numOfRows: numOfRows.toString(),
          pageNo: pageNo.toString(),
          MobileOS: 'ETC',
          MobileApp: 'bookion',
          _type: 'json',
          serviceKey: decodedServiceKey,
          areaCode: areaCode.toString()
        });
        
        const pageUrl = `${baseUrl}?${pageParams.toString()}`;
        const pageResponse = await axios.get(pageUrl);
        
        if (!pageResponse.data || !pageResponse.data.response) {
          console.error(`Invalid API response structure for page ${pageNo}:`, pageResponse.data);
          continue;
        }

        const pageItems = pageResponse.data.response.body.items.item;
        const pageTouristSpots = Array.isArray(pageItems) ? pageItems : [pageItems];
        allTouristSpots = allTouristSpots.concat(pageTouristSpots);
        
        console.log(`Page ${pageNo} fetched: ${pageTouristSpots.length} items`);
      }
    }

    console.log(`Total tourist spots fetched: ${allTouristSpots.length}`);

    // 데이터 동기화 (upsert)
    console.log('Synchronizing tourist spots...');
    const syncResults = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0
    };

    for (const touristSpot of allTouristSpots) {
      try {
        const [instance, created] = await TouristSpot.upsert({
          contentid: touristSpot.contentid,
          contenttypeid: touristSpot.contenttypeid,
          title: touristSpot.title,
          addr1: touristSpot.addr1,
          addr2: touristSpot.addr2,
          tel: touristSpot.tel,
          zipcode: touristSpot.zipcode,
          firstimage: touristSpot.firstimage,
          firstimage2: touristSpot.firstimage2,
          mapx: touristSpot.mapx,
          mapy: touristSpot.mapy,
          cat1: touristSpot.cat1,
          cat2: touristSpot.cat2,
          cat3: touristSpot.cat3,
          areacode: touristSpot.areacode,
          sigungucode: touristSpot.sigungucode,
          createdtime: touristSpot.createdtime,
          modifiedtime: touristSpot.modifiedtime,
          mlevel: touristSpot.mlevel,
          cpyrhtDivCd: touristSpot.cpyrhtDivCd,
          lDongRegnCd: touristSpot.lDongRegnCd,
          lDongSignguCd: touristSpot.lDongSignguCd,
          lclsSystm1: touristSpot.lclsSystm1,
          lclsSystm2: touristSpot.lclsSystm2,
          lclsSystm3: touristSpot.lclsSystm3
        }, {
          returning: true
        });

        if (created) {
          syncResults.created++;
        } else {
          const isChanged = instance.updatedAt > instance.createdAt;
          if (isChanged) {
            syncResults.updated++;
          } else {
            syncResults.unchanged++;
          }
        }
      } catch (error) {
        console.error(`Error upserting tourist spot ${touristSpot.contentid}:`, error);
        syncResults.errors++;
      }
    }

    console.log('Tourist spots synchronization completed:', syncResults);

    // 최종 결과 조회
    const finalCount = await TouristSpot.count({ where: { area_code: areaCode } });
    console.log(`Final tourist spots count in database for area ${areaCode}: ${finalCount}`);

    // sync_log 업데이트
    await syncLog.update({
      created_count: syncResults.created,
      updated_count: syncResults.updated,
      unchanged_count: syncResults.unchanged,
      error_count: syncResults.errors,
      completed_at: new Date()
    });

    return {
      syncResults,
      totalCount: finalCount,
      syncLog
    };
  } catch (error) {
    console.error('Error in fetchTouristSpotsByArea:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    // sync_log 업데이트
    await syncLog.update({
      status: 'error',
      error_message: error.message,
      completed_at: new Date()
    });

    throw new AppError('관광지 정보 동기화 중 오류가 발생했습니다.', 500);
  }
};

/**
 * Tour API에서 분류체계 코드를 가져와 데이터베이스에 저장
 * @param {Object} [options] - 분류체계 코드 조회 옵션
 * @param {string} [options.lclsSystm1] - 1단계 분류체계 코드
 * @param {string} [options.lclsSystm2] - 2단계 분류체계 코드
 * @returns {Promise<Object>} 동기화 결과
 */
const fetchLclsSystmCodes = async (level, parentCode = null) => {
  const syncLog = await createSyncLog('lcls_systm_codes', 'started');

  try {
    // 모델 초기화 대기
    const { LclsSystmCode } = await getModels();
    if (!LclsSystmCode) {
      throw new Error('LclsSystmCode model is not initialized');
    }

    // API URL과 쿼리 파라미터 구성
    const baseUrl = `${TOUR_API_CONFIG.baseUrl}${TOUR_API_CONFIG.endpoints.lclsSystmCode}`;
    const decodedServiceKey = decodeURIComponent(TOUR_API_CONFIG.serviceKey);
    
    // 기본 파라미터
    const baseParams = {
      ...TOUR_API_CONFIG.defaultParams,
      serviceKey: decodedServiceKey,
      lclsSystmListYn: 'Y'
    };

    // 옵션에 따라 파라미터 추가
    if (level === 1) {
      // 레벨 1은 parentCode가 없어도 됨
      if (parentCode) {
        baseParams.lclsSystm1 = parentCode;
      }
    } else if (level === 2) {
      // 레벨 2는 parentCode가 필수
      if (!parentCode) {
        throw new AppError('Level 2 requires parent code', 400);
      }
      baseParams.lclsSystm1 = parentCode;
      baseParams.lclsSystm2 = level;
    } else if (level === 3) {
      // 레벨 3은 parentCode가 필수
      if (!parentCode) {
        throw new AppError('Level 3 requires parent code', 400);
      }
      baseParams.lclsSystm1 = parentCode;
      baseParams.lclsSystm2 = level;
      baseParams.lclsSystm3 = level;
    }

    console.log('API parameters:', baseParams);
    
    // 첫 페이지 요청으로 전체 데이터 수 확인
    const firstPageParams = new URLSearchParams(baseParams);
    const firstPageUrl = `${baseUrl}?${firstPageParams.toString()}`;
    console.log('First page API URL:', firstPageUrl);
    
    const firstPageResponse = await axios.get(firstPageUrl);
    
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure:', firstPageResponse.data);
      throw new AppError('Tour API 응답 구조가 올바르지 않습니다.', 500);
    }

    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== TOUR_API_CONFIG.responseCodes.SUCCESS) {
      console.error('API Error:', { resultCode, resultMsg });
      throw new AppError(`Tour API 오류: ${resultMsg}`, 500);
    }

    const totalCount = firstPageResponse.data.response.body.totalCount;
    console.log('Total lclsSystm codes to fetch:', totalCount);

    // 모든 데이터를 저장할 배열
    let allLclsSystmCodes = firstPageResponse.data.response.body.items.item;
    if (!allLclsSystmCodes) {
      console.log('No lclsSystm codes found in response');
      return {
        syncResults: { created: 0, updated: 0, unchanged: 0, errors: 0 },
        totalCount: 0,
        lclsSystmCodes: []
      };
    }
    allLclsSystmCodes = Array.isArray(allLclsSystmCodes) ? allLclsSystmCodes : [allLclsSystmCodes];

    // 나머지 페이지 데이터 가져오기
    const numOfRows = 99;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    if (totalPages > 1) {
      console.log(`Fetching remaining ${totalPages - 1} pages...`);
      
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (const pageNo of remainingPages) {
        console.log(`Fetching page ${pageNo}...`);
        
        const pageParams = new URLSearchParams({
          ...baseParams,
          pageNo: pageNo.toString()
        });
        
        const pageUrl = `${baseUrl}?${pageParams.toString()}`;
        const pageResponse = await axios.get(pageUrl);
        
        if (!pageResponse.data || !pageResponse.data.response) {
          console.error(`Invalid API response structure for page ${pageNo}:`, pageResponse.data);
          continue;
        }

        const pageItems = pageResponse.data.response.body.items.item;
        if (pageItems) {
          const pageLclsSystmCodes = Array.isArray(pageItems) ? pageItems : [pageItems];
          allLclsSystmCodes = allLclsSystmCodes.concat(pageLclsSystmCodes);
          console.log(`Page ${pageNo} fetched: ${pageLclsSystmCodes.length} items`);
        }
      }
    }

    console.log(`Total lclsSystm codes fetched: ${allLclsSystmCodes.length}`);

    // 데이터 동기화 (upsert)
    console.log('Synchronizing lclsSystm codes...');
    const syncResults = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0
    };

    for (const item of allLclsSystmCodes) {
      try {
        console.log(`Upserting level ${level} code:`, item);
        await LclsSystmCode.upsert({
          code: item[`lclsSystm${level}Cd`],
          name: item[`lclsSystm${level}Nm`],
          rnum: item.rnum,
          level: level,
          parent_code: parentCode,
          lcls_systm1: item.lclsSystm1Cd,
          lcls_systm2: item.lclsSystm2Cd,
          lcls_systm3: item.lclsSystm3Cd
        });
      } catch (error) {
        console.error('Error upserting lclsSystm code:', {
          error: error.message,
          stack: error.stack,
          item
        });
        syncResults.errors++;
      }
    }

    console.log('LclsSystm codes synchronization completed:', syncResults);

    // sync_log 업데이트
    await updateSyncLog(syncLog, {
      total_count: totalCount,
      created_count: syncResults.created,
      updated_count: syncResults.updated,
      unchanged_count: syncResults.unchanged,
      error_count: syncResults.errors,
      status: 'success'
    });

    return { ...syncResults, totalCount: totalCount };
  } catch (error) {
    console.error('Error in fetchLclsSystmCodes:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    // sync_log 업데이트
    await updateSyncLog(syncLog, {
      status: 'error',
      error_message: error.message
    });

    throw new AppError('분류체계 코드 동기화 중 오류가 발생했습니다.', 500);
  }
};

/**
 * 분류체계 코드를 재귀적으로 동기화
 * @param {string} [parentCode=null] - 상위 분류체계 코드
 * @param {number} [level=1] - 현재 분류체계 레벨
 * @param {number} [maxLevel=3] - 최대 분류체계 레벨
 * @returns {Promise<Object>} 동기화 결과
 */
const syncLclsSystmCodesRecursively = async (parentCode = null, level = 1, maxLevel = 3) => {
  // 최대 레벨 제한 확인
  if (level > maxLevel) {
    console.log(`Reached maximum level ${maxLevel}, stopping recursion`);
    return;
  }

  console.log(`Starting lclsSystm code synchronization for level ${level} with parent code ${parentCode || 'NULL'}...`);

  try {
    // 현재 레벨의 분류체계 코드 가져오기
    const result = await fetchLclsSystmCodes(level, parentCode);

    if (!result || !result.lclsSystmCodes || result.lclsSystmCodes.length === 0) {
      console.log(`No codes found for level ${level}`);
      return result;
    }

    const codes = result.lclsSystmCodes;
    console.log(`Found ${codes.length} codes for level ${level}`);

    // 각 코드에 대해 재귀적으로 하위 분류체계 동기화
    for (const code of codes) {
      console.log(`Processing code: ${code.code} (${code.name}) at level ${level}`);
      
      // 다음 레벨의 분류체계 동기화
      if (level < maxLevel) {
        console.log(`Recursively fetching level ${level + 1} codes for parent ${code.code}`);
        await syncLclsSystmCodesRecursively(code.code, level + 1, maxLevel);
      }
    }

    return result;
  } catch (error) {
    console.error(`Error in syncLclsSystmCodesRecursively for level ${level}:`, error);
    throw error;
  }
};

/**
 * 모든 분류체계 코드를 계층적으로 동기화
 * @returns {Promise<Object>} 동기화 결과
 */
const syncAllLclsSystmCodes = async () => {
  try {
    console.log('Starting complete lclsSystm code synchronization...');
    
    // 레벨 1부터 시작하여 재귀적으로 모든 분류체계 동기화
    const result = await syncLclsSystmCodesRecursively(null, 1, 3);
    console.log('LclsSystm code synchronization completed successfully');

    return {
      message: '모든 분류체계 코드 동기화가 완료되었습니다.',
      status: 'success',
      result
    };
  } catch (error) {
    console.error('Error in syncAllLclsSystmCodes:', error);
    throw new AppError('분류체계 코드 동기화 중 오류가 발생했습니다.', 500);
  }
};

const fetchAreaBasedList2Sync = async (params) => {
  if (!params.areaCode) {
    throw new AppError('areaCode는 필수 파라미터입니다.', 400);
  }

  const syncLog = await SyncLog.create({
    api_name: 'areaBasedList2Sync',
    total_count: 0,
    status: 'success',
    started_at: new Date()
  });

  try {
    console.log('Starting area-based tour info synchronization...', params);
    
    // API URL과 쿼리 파라미터 구성
    const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';
    const decodedServiceKey = decodeURIComponent(TOUR_API.KEY);
    
    // 첫 페이지 요청으로 전체 데이터 수 확인
    const firstPageParams = new URLSearchParams({
      numOfRows: '99',
      pageNo: '1',
      MobileOS: 'ETC',
      MobileApp: 'bookion',
      _type: 'json',
      serviceKey: decodedServiceKey,
      areaCode: params.areaCode,
      ...(params.sigunguCode && { sigunguCode: params.sigunguCode }),
      ...(params.contentTypeId && { contentTypeId: params.contentTypeId }),
      ...(params.cat1 && { cat1: params.cat1 }),
      ...(params.cat2 && { cat2: params.cat2 }),
      ...(params.cat3 && { cat3: params.cat3 }),
      ...(params.arrange && { arrange: params.arrange })
    });
    
    const firstPageUrl = `${baseUrl}?${firstPageParams.toString()}`;
    console.log('First page API URL:', firstPageUrl);
    
    const firstPageResponse = await axios.get(firstPageUrl);
    
    if (!firstPageResponse.data || !firstPageResponse.data.response) {
      console.error('Invalid API response structure:', firstPageResponse.data);
      throw new AppError('Tour API 응답 구조가 올바르지 않습니다.', 500);
    }

    const { resultCode, resultMsg } = firstPageResponse.data.response.header;
    if (resultCode !== '0000') {
      console.error('API Error:', { resultCode, resultMsg });
      throw new AppError(`Tour API 오류: ${resultMsg}`, 500);
    }

    const totalCount = firstPageResponse.data.response.body.totalCount;
    console.log('Total tour info to fetch:', totalCount);

    // sync_log 업데이트
    await syncLog.update({ total_count: totalCount });

    // 모든 데이터를 저장할 배열
    let allTourInfo = firstPageResponse.data.response.body.items.item;
    allTourInfo = Array.isArray(allTourInfo) ? allTourInfo : [allTourInfo];

    // 나머지 페이지 데이터 가져오기
    const numOfRows = 99;
    const totalPages = Math.ceil(totalCount / numOfRows);
    
    if (totalPages > 1) {
      console.log(`Fetching remaining ${totalPages - 1} pages...`);
      
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      
      for (const pageNo of remainingPages) {
        console.log(`Fetching page ${pageNo}...`);
        
        const pageParams = new URLSearchParams({
          numOfRows: numOfRows.toString(),
          pageNo: pageNo.toString(),
          MobileOS: 'ETC',
          MobileApp: 'bookion',
          _type: 'json',
          serviceKey: decodedServiceKey,
          areaCode: params.areaCode,
          ...(params.sigunguCode && { sigunguCode: params.sigunguCode }),
          ...(params.contentTypeId && { contentTypeId: params.contentTypeId }),
          ...(params.cat1 && { cat1: params.cat1 }),
          ...(params.cat2 && { cat2: params.cat2 }),
          ...(params.cat3 && { cat3: params.cat3 }),
          ...(params.arrange && { arrange: params.arrange })
        });
        
        const pageUrl = `${baseUrl}?${pageParams.toString()}`;
        const pageResponse = await axios.get(pageUrl);
        
        if (!pageResponse.data || !pageResponse.data.response) {
          console.error(`Invalid API response structure for page ${pageNo}:`, pageResponse.data);
          continue;
        }

        const pageItems = pageResponse.data.response.body.items.item;
        const pageTourInfo = Array.isArray(pageItems) ? pageItems : [pageItems];
        allTourInfo = allTourInfo.concat(pageTourInfo);
        
        console.log(`Page ${pageNo} fetched: ${pageTourInfo.length} items`);
      }
    }

    console.log(`Total tour info fetched: ${allTourInfo.length}`);

    // 데이터 동기화 (upsert)
    console.log('Synchronizing tour info...');
    const syncResults = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0
    };

    for (const item of allTourInfo) {
      try {
        // 기존 데이터 조회
        const existingSpot = await TouristSpot.findOne({
          where: { contentId: item.contentid || item.contentId }
        });

        const spotData = {
          contentId: item.contentid || item.contentId,
          contentTypeId: item.contenttypeid,
          title: item.title,
          addr1: item.addr1,
          addr2: item.addr2,
          tel: item.tel,
          zipcode: item.zipcode,
          firstimage: item.firstimage,
          firstimage2: item.firstimage2,
          mapx: item.mapx,
          mapy: item.mapy,
          cat1: item.cat1,
          cat2: item.cat2,
          cat3: item.cat3,
          areaCode: item.areacode || params.areaCode,
          sigunguCode: item.sigungucode,
          createdtime: item.createdtime,
          modifiedtime: item.modifiedtime,
          mlevel: item.mlevel,
          cpyrhtDivCd: item.cpyrhtDivCd,
          lDongRegnCd: item.lDongRegnCd,
          lDongSignguCd: item.lDongSignguCd,
          lclsSystm1: item.lclsSystm1,
          lclsSystm2: item.lclsSystm2,
          lclsSystm3: item.lclsSystm3
        };

        if (!existingSpot) {
          // 새로운 데이터 생성
          await TouristSpot.create(spotData);
          syncResults.created++;
        } else if (item.modifiedtime && existingSpot.modifiedtime !== item.modifiedtime) {
          // modifiedtime이 변경된 경우에만 업데이트
          const changedFields = {};
          Object.keys(spotData).forEach(key => {
            if (spotData[key] !== existingSpot[key]) {
              changedFields[key] = spotData[key];
            }
          });

          if (Object.keys(changedFields).length > 0) {
            await existingSpot.update(changedFields);
            syncResults.updated++;
          } else {
            syncResults.unchanged++;
          }
        } else {
          syncResults.unchanged++;
        }
      } catch (error) {
        console.error(`Error upserting tour info ${item.contentid}:`, error);
        syncResults.errors++;
      }
    }

    console.log('Tour info synchronization completed:', syncResults);

    // 최종 결과 조회
    const finalCount = await TouristSpot.count({ 
      where: { 
        areaCode: params.areaCode,
        ...(params.sigunguCode && { sigunguCode: params.sigunguCode }),
        ...(params.contentTypeId && { contentTypeId: params.contentTypeId })
      } 
    });
    console.log(`Final tour info count in database: ${finalCount}`);

    // sync_log 업데이트
    await syncLog.update({
      created_count: syncResults.created,
      updated_count: syncResults.updated,
      unchanged_count: syncResults.unchanged,
      error_count: syncResults.errors,
      completed_at: new Date()
    });

    return {
      syncResults,
      totalCount: finalCount,
      syncLog
    };
  } catch (error) {
    console.error('Error in fetchAreaBasedList2Sync:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        headers: error.config?.headers
      }
    });

    // sync_log 업데이트
    await syncLog.update({
      status: 'error',
      error_message: error.message,
      completed_at: new Date()
    });

    throw new AppError('지역기반 관광정보 동기화 중 오류가 발생했습니다.', 500);
  }
};

const fetchAreaBasedList2Async = async (params = {}) => {
  const syncLog = await SyncLog.create({
    api_name: 'areaBasedList2Async',
    total_count: 0,
    status: 'pending',
    started_at: new Date()
  });

  // 비동기 작업을 즉시 시작하고 응답 반환
  (async () => {
    try {
      // 모든 지역 코드 조회
      const areaCodes = await AreaCode.findAll({
        attributes: ['code']
      });

      console.log(`Starting async area-based tour info synchronization for ${areaCodes.length} areas...`);

      // 각 지역별로 동기화 작업 실행
      for (const areaCode of areaCodes) {
        try {
          console.log(`Processing area code: ${areaCode.code}`);
          await fetchAreaBasedList2Sync({
            ...params,
            areaCode: areaCode.code
          });
        } catch (error) {
          console.error(`Error processing area code ${areaCode.code}:`, error);
          // 개별 지역 코드 처리 실패는 전체 작업을 중단하지 않음
        }
      }

      // sync_log 업데이트
      await syncLog.update({
        status: 'success',
        completed_at: new Date()
      });

    } catch (error) {
      console.error('Error in fetchAreaBasedList2Async:', error);

      // sync_log 업데이트
      await syncLog.update({
        status: 'error',
        error_message: error.message,
        completed_at: new Date()
      });
    }
  })();

  // 즉시 syncLogId 반환
  return {
    message: '지역기반 관광정보 비동기 동기화가 시작되었습니다.',
    syncLogId: syncLog.id
  };
};

module.exports = {
  fetchAreaCodes,
  fetchCategoryCodes,
  fetchTouristSpotsByArea,
  syncAllCategoryCodes,
  fetchLclsSystmCodes,
  syncAllLclsSystmCodes,
  fetchAreaBasedList2Sync,
  fetchAreaBasedList2Async
}; 