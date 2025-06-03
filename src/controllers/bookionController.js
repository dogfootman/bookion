const { catchAsync } = require('../utils/errorHandler');
const bookionService = require('../services/bookionService');
const { AppError } = require('../utils/errorHandler');

/**
 * 지역 코드 목록 조회
 * @route POST /api/v1/bookion/area-codes
 */
const getAreaCodes = catchAsync(async (req, res) => {
  const result = await bookionService.getAreaCodes(req.body);
  res.json(result);
});

/**
 * 지역 코드 상세 조회
 * @route GET /api/v1/bookion/area-codes/:id
 */
const getAreaCodeDetail = catchAsync(async (req, res) => {
  const result = await bookionService.getAreaCodeDetail(parseInt(req.params.id));
  res.json(result);
});

/**
 * 카테고리 코드 목록 조회
 * @route POST /api/v1/bookion/category-codes
 */
const getCategoryCodes = catchAsync(async (req, res) => {
  const result = await bookionService.getCategoryCodes(req.body);
  res.json(result);
});

/**
 * 카테고리 코드 상세 조회
 * @route GET /api/v1/bookion/category-codes/:id
 */
const getCategoryCodeDetail = catchAsync(async (req, res) => {
  const result = await bookionService.getCategoryCodeDetail(parseInt(req.params.id));
  res.json(result);
});

/**
 * 관광지 정보 목록 조회
 * @route POST /api/v1/bookion/tourist-spots
 */
const getTouristSpots = catchAsync(async (req, res) => {
  const result = await bookionService.getTouristSpots(req.body);
  res.json(result);
});

/**
 * 관광지 정보 상세 조회
 * @route GET /api/v1/bookion/tourist-spots/:id
 */
const getTouristSpotDetail = catchAsync(async (req, res) => {
  const result = await bookionService.getTouristSpotDetail(parseInt(req.params.id));
  res.json(result);
});

/**
 * 분류체계 코드 목록 조회
 * @route POST /api/v1/bookion/lcls-systm-codes
 */
const getLclsSystmCodes = catchAsync(async (req, res) => {
  const result = await bookionService.getLclsSystmCodes(req.body);
  res.json(result);
});

/**
 * 분류체계 코드 상세 조회
 * @route GET /api/v1/bookion/lcls-systm-codes/:id
 */
const getLclsSystmCodeDetail = catchAsync(async (req, res) => {
  const result = await bookionService.getLclsSystmCodeDetail(parseInt(req.params.id));
  res.json(result);
});

/**
 * 지역기반 관광정보 목록 조회
 * @route POST /api/v1/bookion/area-based-list
 */
const getAreaBasedList = catchAsync(async (req, res) => {
  const result = await bookionService.getAreaBasedList(req.body);
  res.json(result);
});

module.exports = {
  getAreaCodes,
  getAreaCodeDetail,
  getCategoryCodes,
  getCategoryCodeDetail,
  getTouristSpots,
  getTouristSpotDetail,
  getLclsSystmCodes,
  getLclsSystmCodeDetail,
  getAreaBasedList
}; 