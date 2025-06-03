const ApiKey = require('../models/apiKey');
const { catchAsync } = require('../utils/errorHandler');
const crypto = require('crypto');

/**
 * 새로운 API 키를 생성합니다.
 * Swagger operationId: createApiKey
 */
exports.createApiKey = catchAsync(async (req, res) => {
  const {
    clientName,
    expiresAt,
    rateLimit,
    allowedIps
  } = req.body;
  
  // 관리자 정보가 있으면 사용, 없으면 기본값
  const createdBy = req.admin ? req.admin.id : null;
  
  // API 키 생성
  const apiKey = await ApiKey.create({
    client_name: clientName,
    expires_at: expiresAt,
    rate_limit: rateLimit,
    allowed_ips: allowedIps,
    created_by: createdBy
  });
  
  // 응답에 secret_key를 포함하여 반환 (최초 생성 시에만)
  res.status(201).json({
    status: 'success',
    data: {
      id: apiKey.id,
      clientName: apiKey.client_name,
      apiKey: apiKey.api_key,
      secretKey: apiKey.secret_key, // 주의: 이 값은 최초 생성 시에만 제공
      expiresAt: apiKey.expires_at,
      rateLimit: apiKey.rate_limit,
      allowedIps: apiKey.allowed_ips,
      isActive: apiKey.is_active,
      createdAt: apiKey.created_at
    },
    message: 'API 키가 성공적으로 생성되었습니다.'
  });
});

/**
 * API 키를 갱신합니다.
 * Swagger operationId: rotateApiKey
 */
exports.rotateApiKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const apiKey = await ApiKey.findByPk(id);
  
  if (!apiKey) {
    return res.status(404).json({
      status: 'fail',
      message: '해당 API 키를 찾을 수 없습니다.'
    });
  }
  
  // 새로운 키 생성
  const newApiKey = crypto.randomBytes(32).toString('hex');
  const newSecretKey = crypto.randomBytes(32).toString('hex');
  
  await apiKey.update({
    api_key: newApiKey,
    secret_key: newSecretKey
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      id: apiKey.id,
      clientName: apiKey.client_name,
      apiKey: newApiKey,
      secretKey: newSecretKey,
      expiresAt: apiKey.expires_at
    },
    message: 'API 키가 성공적으로 갱신되었습니다.'
  });
});

/**
 * API 키를 비활성화합니다.
 * Swagger operationId: deactivateApiKey
 */
exports.deactivateApiKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const apiKey = await ApiKey.findByPk(id);
  
  if (!apiKey) {
    return res.status(404).json({
      status: 'fail',
      message: '해당 API 키를 찾을 수 없습니다.'
    });
  }
  
  await apiKey.update({
    is_active: false
  });
  
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'API 키가 성공적으로 비활성화되었습니다.'
  });
});

/**
 * API 키를 활성화합니다.
 * Swagger operationId: activateApiKey
 */
exports.activateApiKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const apiKey = await ApiKey.findByPk(id);
  
  if (!apiKey) {
    return res.status(404).json({
      status: 'fail',
      message: '해당 API 키를 찾을 수 없습니다.'
    });
  }
  
  await apiKey.update({
    is_active: true
  });
  
  res.status(200).json({
    status: 'success',
    data: null,
    message: 'API 키가 성공적으로 활성화되었습니다.'
  });
});

/**
 * 모든 API 키 목록을 조회합니다.
 * Swagger operationId: getAllApiKeys
 */
exports.getAllApiKeys = catchAsync(async (req, res) => {
  const apiKeys = await ApiKey.findAll({
    attributes: { exclude: ['secret_key'] } // 보안을 위해 secret_key는 제외
  });
  
  res.status(200).json({
    status: 'success',
    results: apiKeys.length,
    data: { apiKeys },
    message: 'API 키 목록을 성공적으로 조회했습니다.'
  });
});

/**
 * 특정 API 키의 상세 정보를 조회합니다.
 * Swagger operationId: getApiKeyById
 */
exports.getApiKeyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const apiKey = await ApiKey.findByPk(id, {
    attributes: { exclude: ['secret_key'] } // 보안을 위해 secret_key는 제외
  });
  
  if (!apiKey) {
    return res.status(404).json({
      status: 'fail',
      message: '해당 API 키를 찾을 수 없습니다.'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: { apiKey },
    message: 'API 키 정보를 성공적으로 조회했습니다.'
  });
});
