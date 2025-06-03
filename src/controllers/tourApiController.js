const { AreaCode, CategoryCode, TouristSpot, SyncLog } = require('../models');
const tourApiService = require('../services/tourApiService');
const { catchAsync } = require('../utils/errorHandler');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorHandler');

/**
 * 지역 코드 동기화
 * @route POST /api/v1/tour-api/sync/area-codes
 */
const syncAreaCodes = catchAsync(async (req, res) => {
  const areaCodes = await tourApiService.fetchAreaCodes();
  res.status(200).json({
    status: 'success',
    data: areaCodes
  });
});

/**
 * 카테고리 코드 동기화
 * @route POST /api/v1/tour-api/sync/category-codes
 */
const syncCategoryCodes = catchAsync(async (req, res) => {
  const categoryCodes = await tourApiService.fetchCategoryCodes();
  res.status(200).json({
    status: 'success',
    data: categoryCodes
  });
});

/**
 * 관광지 정보 동기화
 * @route POST /api/v1/tour-api/sync/tourist-spots/:areaCode
 */
const syncTouristSpots = catchAsync(async (req, res) => {
  const { areaCode } = req.params;
  const touristSpots = await tourApiService.fetchTouristSpotsByArea(areaCode);
  res.status(200).json({
    status: 'success',
    data: touristSpots
  });
});

/**
 * Sync tourist spots by area code from tour API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const syncTouristSpotsByArea = async (req, res, next) => {
  try {
    const { areaCode } = req.params;
    const touristSpots = await tourApiService.fetchTouristSpotsByArea(areaCode);
    await TouristSpot.bulkCreate(touristSpots, {
      updateOnDuplicate: [
        'title', 'address', 'road_address', 'tel', 'zipcode',
        'first_image', 'second_image', 'map_x', 'map_y',
        'overview', 'cat1', 'cat2', 'cat3'
      ]
    });
    
    res.status(200).json({
      success: true,
      message: `Tourist spots for area ${areaCode} synchronized successfully`,
      count: touristSpots.length
    });
  } catch (error) {
    next(new ApiError(500, 'Failed to sync tourist spots for area', error));
  }
};

/**
 * 분류체계 코드 동기화
 * @route POST /api/v1/tour-api/lcls-systm-codes/sync
 */
const syncLclsSystmCodes = catchAsync(async (req, res) => {
  const lclsSystmCodes = await tourApiService.syncAllLclsSystmCodes();
  res.status(200).json({
    status: 'success',
    data: lclsSystmCodes
  });
});

/**
 * 지역기반 관광정보 동기화 (동기)
 * @swagger
 * /api/v1/tour/area-based-list/sync:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 지역기반 관광정보 동기화 (동기)
 *     description: 특정 지역의 관광정보를 동기화합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - areaCode
 *             properties:
 *               areaCode:
 *                 type: string
 *                 description: 지역코드
 *               sigunguCode:
 *                 type: string
 *                 description: 시군구코드
 *               contentTypeId:
 *                 type: string
 *                 description: 관광타입 ID
 *               cat1:
 *                 type: string
 *                 description: 대분류 코드
 *               cat2:
 *                 type: string
 *                 description: 중분류 코드
 *               cat3:
 *                 type: string
 *                 description: 소분류 코드
 *               arrange:
 *                 type: string
 *                 description: 정렬구분 (A=제목순, C=수정일순, D=생성일순)
 *     responses:
 *       200:
 *         description: 동기화 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
const areaBasedList2Sync = async (req, res, next) => {
  try {
    const result = await tourApiService.fetchAreaBasedList2Sync(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 지역기반 관광정보 동기화 (비동기)
 * @swagger
 * /api/v1/tour/area-based-list/async:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 지역기반 관광정보 동기화 (비동기)
 *     description: 모든 지역의 관광정보를 비동기적으로 동기화합니다.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentTypeId:
 *                 type: string
 *                 description: 관광타입 ID
 *               cat1:
 *                 type: string
 *                 description: 대분류 코드
 *               cat2:
 *                 type: string
 *                 description: 중분류 코드
 *               cat3:
 *                 type: string
 *                 description: 소분류 코드
 *               arrange:
 *                 type: string
 *                 description: 정렬구분 (A=제목순, C=수정일순, D=생성일순)
 *     responses:
 *       200:
 *         description: 동기화 시작
 *       500:
 *         description: 서버 오류
 */
const areaBasedList2Async = async (req, res, next) => {
  try {
    const result = await tourApiService.fetchAreaBasedList2Async(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 지역기반 관광정보 동기화 상태 확인
 * @swagger
 * /api/v1/tour-api/sync/area-based-list2/status/{syncLogId}:
 *   get:
 *     tags:
 *       - Tour API
 *     summary: 지역기반 관광정보 동기화 상태 확인
 *     description: 동기화 작업의 진행 상태를 확인합니다.
 *     parameters:
 *       - in: path
 *         name: syncLogId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 동기화 로그 ID
 *     responses:
 *       200:
 *         description: 동기화 상태
 *       404:
 *         description: 동기화 로그를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const getAreaBasedList2SyncStatus = catchAsync(async (req, res) => {
  const { syncLogId } = req.params;
  const syncLog = await SyncLog.findByPk(syncLogId);
  
  if (!syncLog) {
    throw new AppError('동기화 로그를 찾을 수 없습니다.', 404);
  }
  
  res.json({
    status: 'success',
    data: syncLog
  });
});

module.exports = {
  syncAreaCodes,
  syncCategoryCodes,
  syncTouristSpots,
  syncTouristSpotsByArea,
  syncLclsSystmCodes,
  areaBasedList2Sync,
  areaBasedList2Async,
  getAreaBasedList2SyncStatus
}; 