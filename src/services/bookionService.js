const { Op } = require('sequelize');
const getModels = require('../models/tour/index');
const { AppError } = require('../utils/errorHandler');

// 공통 유틸리티 함수
const buildWhereClause = (filters) => {
  if (!filters) return {};
  
  const where = {};
  const exactMatchFields = [
    'area_code', 'areaCode',
    'sigungu_code', 'sigunguCode',
    'content_type_id', 'contentTypeId',
    'cat1', 'cat2', 'cat3'
  ];
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Convert camelCase to snake_case for database column names
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (exactMatchFields.includes(key)) {
        where[dbKey] = value;
      } else if (typeof value === 'string') {
        where[dbKey] = {
          [Op.like]: `%${value}%`
        };
      } else {
        where[dbKey] = value;
      }
    }
  });
  
  console.log('Final where clause:', where);
  return where;
};

// 지역 코드 조회
const getAreaCodes = async (request = {}) => {
  const { AreaCode } = await getModels();
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy, 
    sortOrder
  } = request;
  
  // Use the entire request body as filters, excluding pagination and sorting params
  const filters = { ...request };
  delete filters.page;
  delete filters.pageSize;
  delete filters.sortBy;
  delete filters.sortOrder;
  
  console.log('Original filters:', filters);
  
  // Convert snake_case to camelCase for filters
  const convertedFilters = {};
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedFilters[camelKey] = value;
    });
  }
  
  console.log('Converted filters:', convertedFilters);
  
  const where = buildWhereClause(convertedFilters);
  console.log('Final where clause:', where);
  
  const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : undefined;
  
  // Convert page and pageSize to numbers
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  
  const { rows, count } = await AreaCode.findAndCountAll({
    where,
    order,
    limit: pageSizeNum,
    offset: (pageNum - 1) * pageSizeNum
  });
  
  return {
    items: rows,
    total: count,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(count / pageSizeNum)
  };
};

const getAreaCodeDetail = async (id) => {
  const { AreaCode } = await getModels();
  const areaCode = await AreaCode.findByPk(id);
  if (!areaCode) {
    throw new AppError('Area code not found', 404);
  }
  return areaCode;
};

// 카테고리 코드 조회
const getCategoryCodes = async (request = {}) => {
  const { CategoryCode } = await getModels();
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy, 
    sortOrder
  } = request;
  
  // Use the entire request body as filters, excluding pagination and sorting params
  const filters = { ...request };
  delete filters.page;
  delete filters.pageSize;
  delete filters.sortBy;
  delete filters.sortOrder;
  
  console.log('Original filters:', filters);
  
  // Convert snake_case to camelCase for filters
  const convertedFilters = {};
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedFilters[camelKey] = value;
    });
  }
  
  console.log('Converted filters:', convertedFilters);
  
  const where = buildWhereClause(convertedFilters);
  console.log('Final where clause:', where);
  
  const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : undefined;
  
  // Convert page and pageSize to numbers
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  
  const { rows, count } = await CategoryCode.findAndCountAll({
    where,
    order,
    limit: pageSizeNum,
    offset: (pageNum - 1) * pageSizeNum
  });
  
  return {
    items: rows,
    total: count,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(count / pageSizeNum)
  };
};

const getCategoryCodeDetail = async (id) => {
  const { CategoryCode } = await getModels();
  const categoryCode = await CategoryCode.findByPk(id);
  if (!categoryCode) {
    throw new AppError('Category code not found', 404);
  }
  return categoryCode;
};

// 관광지 정보 조회
const getTouristSpots = async (request = {}) => {
  const { TouristSpot } = await getModels();
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy, 
    sortOrder
  } = request;
  
  // Use the entire request body as filters, excluding pagination and sorting params
  const filters = { ...request };
  delete filters.page;
  delete filters.pageSize;
  delete filters.sortBy;
  delete filters.sortOrder;
  
  console.log('Original filters:', filters);
  
  // Convert snake_case to camelCase for filters
  const convertedFilters = {};
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedFilters[camelKey] = value;
    });
  }
  
  console.log('Converted filters:', convertedFilters);
  
  const where = buildWhereClause(convertedFilters);
  
  const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : undefined;
  
  // Convert page and pageSize to numbers and ensure they are valid
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSizeNum = Math.max(1, parseInt(pageSize, 10) || 10);
  
  console.log('Pagination params:', { page: pageNum, pageSize: pageSizeNum });
  
  const { rows, count } = await TouristSpot.findAndCountAll({
    where,
    order,
    limit: pageSizeNum,
    offset: (pageNum - 1) * pageSizeNum
  });
  
  console.log('Query result:', { count, rowsCount: rows.length });
  
  return {
    items: rows,
    total: count,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(count / pageSizeNum)
  };
};

const getTouristSpotDetail = async (id) => {
  const { TouristSpot } = await getModels();
  const touristSpot = await TouristSpot.findByPk(id);
  if (!touristSpot) {
    throw new AppError('Tourist spot not found', 404);
  }
  return touristSpot;
};

// 분류체계 코드 조회
const getLclsSystmCodes = async (request = {}) => {
  const { LclsSystmCode } = await getModels();
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy, 
    sortOrder
  } = request;
  
  // Use the entire request body as filters, excluding pagination and sorting params
  const filters = { ...request };
  delete filters.page;
  delete filters.pageSize;
  delete filters.sortBy;
  delete filters.sortOrder;
  
  console.log('Original filters:', filters);
  
  // Convert snake_case to camelCase for filters
  const convertedFilters = {};
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedFilters[camelKey] = value;
    });
  }
  
  console.log('Converted filters:', convertedFilters);
  
  const where = buildWhereClause(convertedFilters);
  console.log('Final where clause:', where);
  
  const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : undefined;
  
  // Convert page and pageSize to numbers
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  
  const { rows, count } = await LclsSystmCode.findAndCountAll({
    where,
    order,
    limit: pageSizeNum,
    offset: (pageNum - 1) * pageSizeNum
  });
  
  return {
    items: rows,
    total: count,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(count / pageSizeNum)
  };
};

const getLclsSystmCodeDetail = async (id) => {
  const { LclsSystmCode } = await getModels();
  const lclsSystmCode = await LclsSystmCode.findByPk(id);
  if (!lclsSystmCode) {
    throw new AppError('Classification system code not found', 404);
  }
  return lclsSystmCode;
};

// 지역기반 관광정보 조회
const getAreaBasedList = async (request = {}) => {
  const { TouristSpot } = await getModels();
  const { 
    page = 1, 
    pageSize = 10, 
    sortBy, 
    sortOrder
  } = request;
  
  // Use the entire request body as filters, excluding pagination and sorting params
  const filters = { ...request };
  delete filters.page;
  delete filters.pageSize;
  delete filters.sortBy;
  delete filters.sortOrder;
  
  console.log('Original filters:', filters);
  
  // Convert snake_case to camelCase for filters
  const convertedFilters = {};
  if (Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedFilters[camelKey] = value;
    });
  }
  
  console.log('Converted filters:', convertedFilters);
  
  const where = buildWhereClause(convertedFilters);
  console.log('Final where clause:', where);
  
  const order = sortBy ? [[sortBy, sortOrder || 'ASC']] : undefined;
  
  // Convert page and pageSize to numbers
  const pageNum = parseInt(page, 10);
  const pageSizeNum = parseInt(pageSize, 10);
  
  const { rows, count } = await TouristSpot.findAndCountAll({
    where,
    order,
    limit: pageSizeNum,
    offset: (pageNum - 1) * pageSizeNum
  });
  
  return {
    items: rows,
    total: count,
    page: pageNum,
    pageSize: pageSizeNum,
    totalPages: Math.ceil(count / pageSizeNum)
  };
};

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