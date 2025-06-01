const { AreaCode, CategoryCode, TouristSpot } = require('../models/tour');
const tourApiService = require('../services/tourApiService');
const { catchAsync } = require('../utils/errorHandler');

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
 * @route POST /api/v1/tour-api/sync/lcls-systm-codes
 */
const syncLclsSystmCodes = catchAsync(async (req, res) => {
  const lclsSystmCodes = await tourApiService.syncAllLclsSystmCodes();
  res.status(200).json({
    status: 'success',
    data: lclsSystmCodes
  });
});

module.exports = {
  syncAreaCodes,
  syncCategoryCodes,
  syncTouristSpots,
  syncTouristSpotsByArea,
  syncLclsSystmCodes
}; 