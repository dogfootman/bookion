const express = require('express');
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateAdmin } = require('../middlewares/apiAuth');
const router = express.Router();

// 모든 API 키 관리 라우트는 관리자 인증이 필요
router.use(authenticateAdmin);

/**
 * @swagger
 * /api-keys:
 *   post:
 *     tags:
 *       - API Keys
 *     summary: 새로운 API 키를 생성합니다
 *     description: 특정 클라이언트를 위한 새로운 API 키를 생성합니다 (관리자 권한 필요)
 *     operationId: createApiKey
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: 클라이언트 이름
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: 키 만료 일시 (기본값은 1년 후)
 *               rateLimit:
 *                 type: integer
 *                 description: 시간당 허용 요청 수 (기본값은 100)
 *               allowedIps:
 *                 type: string
 *                 description: 허용된 IP 목록 (쉼표로 구분)
 *     responses:
 *       201:
 *         description: API 키 생성 성공
 */
router.post('/', apiKeyController.createApiKey);

/**
 * @swagger
 * /api-keys:
 *   get:
 *     tags:
 *       - API Keys
 *     summary: 모든 API 키 목록을 조회합니다
 *     description: 시스템에 등록된 모든 API 키 목록을 조회합니다 (관리자 권한 필요)
 *     operationId: getAllApiKeys
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API 키 목록 조회 성공
 */
router.get('/', apiKeyController.getAllApiKeys);

/**
 * @swagger
 * /api-keys/{id}:
 *   get:
 *     tags:
 *       - API Keys
 *     summary: API 키 정보를 조회합니다
 *     description: 특정 API 키의 상세 정보를 조회합니다 (관리자 권한 필요)
 *     operationId: getApiKeyById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API 키 ID
 *     responses:
 *       200:
 *         description: API 키 정보 조회 성공
 */
router.get('/:id', apiKeyController.getApiKeyById);

/**
 * @swagger
 * /api-keys/{id}/rotate:
 *   post:
 *     tags:
 *       - API Keys
 *     summary: API 키를 갱신합니다
 *     description: 기존 API 키를 새로운 키로 갱신합니다 (관리자 권한 필요)
 *     operationId: rotateApiKey
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API 키 ID
 *     responses:
 *       200:
 *         description: API 키 갱신 성공
 */
router.post('/:id/rotate', apiKeyController.rotateApiKey);

/**
 * @swagger
 * /api-keys/{id}/deactivate:
 *   post:
 *     tags:
 *       - API Keys
 *     summary: API 키를 비활성화합니다
 *     description: API 키를 비활성화하여 더 이상 사용할 수 없게 합니다 (관리자 권한 필요)
 *     operationId: deactivateApiKey
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API 키 ID
 *     responses:
 *       200:
 *         description: API 키 비활성화 성공
 */
router.post('/:id/deactivate', apiKeyController.deactivateApiKey);

/**
 * @swagger
 * /api-keys/{id}/activate:
 *   post:
 *     tags:
 *       - API Keys
 *     summary: API 키를 활성화합니다
 *     description: 비활성화된 API 키를 다시 활성화합니다 (관리자 권한 필요)
 *     operationId: activateApiKey
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API 키 ID
 *     responses:
 *       200:
 *         description: API 키 활성화 성공
 */
router.post('/:id/activate', apiKeyController.activateApiKey);

module.exports = router;
