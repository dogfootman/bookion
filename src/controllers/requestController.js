const requestService = require('../services/requestService');
const { catchAsync } = require('../utils/errorHandler');

/**
 * 사용자의 여행 정보 요청을 생성합니다.
 * Swagger operationId: createRequest
 */
exports.createRequest = catchAsync(async (req, res) => {
  const request = await requestService.createRequest(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { request },
    message: '요청이 성공적으로 생성되었습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 특정 요청의 상세 정보를 조회합니다.
 * Swagger operationId: getRequestById
 */
exports.getRequestById = catchAsync(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id);
  
  res.status(200).json({
    status: 'success',
    data: { request },
    message: '요청 정보 조회에 성공했습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 모든 요청 목록을 조회합니다.
 * Swagger operationId: getAllRequests
 */
exports.getAllRequests = catchAsync(async (req, res) => {
  const requests = await requestService.getAllRequests(req.query);
  
  res.status(200).json({
    status: 'success',
    results: requests.length,
    data: { requests },
    message: '요청 목록 조회에 성공했습니다.',
    timestamp: new Date().toISOString()
  });
});

/**
 * 요청 상태를 업데이트합니다.
 * Swagger operationId: updateRequestStatus
 */
exports.updateRequestStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const request = await requestService.updateRequestStatus(id, status);
  
  res.status(200).json({
    status: 'success',
    data: { request },
    message: '요청 상태가 성공적으로 업데이트되었습니다.',
    timestamp: new Date().toISOString()
  });
});