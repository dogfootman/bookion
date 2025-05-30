const express = require('express');
const requestController = require('../controllers/requestController');
const { authenticateApiKey } = require('../middlewares/apiAuth');
const { validateRequest, validateIdParam, validateStatusUpdate, validatePagination } = require('../middlewares/validator');

const router = express.Router();

// API 키 인증 적용
router.use(authenticateApiKey);

/**
 * @swagger
 * /api/v1/requests:
 *   post:
 *     tags:
 *       - Requests
 *     summary: 여행 정보 요청을 생성합니다
 *     description: 사용자의 여행 정보 요청을 저장하고 처리 프로세스를 시작합니다
 *     operationId: createRequest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestInput'
 *     responses:
 *       201:
 *         description: 요청이 성공적으로 생성됨
 */
router.post('/', validateRequest, requestController.createRequest);

/**
 * @swagger
 * /api/v1/requests/{id}:
 *   get:
 *     tags:
 *       - Requests
 *     summary: 요청 정보를 조회합니다
 *     description: 요청 ID를 기반으로 요청 상세 정보를 조회합니다
 *     operationId: getRequestById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 요청 ID
 *     responses:
 *       200:
 *         description: 요청 정보 조회 성공
 */
router.get('/:id', validateIdParam, requestController.getRequestById);

/**
 * @swagger
 * /api/v1/requests:
 *   get:
 *     tags:
 *       - Requests
 *     summary: 모든 요청 목록을 조회합니다
 *     description: 요청 목록을 페이지네이션하여 조회합니다
 *     operationId: getAllRequests
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *         description: 요청 상태로 필터링 (선택 사항)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호 (선택 사항)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 페이지당 항목 수 (선택 사항)
 *     responses:
 *       200:
 *         description: 요청 목록 조회 성공
 */
router.get('/', validatePagination, requestController.getAllRequests);

/**
 * @swagger
 * /api/v1/requests/{id}/status:
 *   patch:
 *     tags:
 *       - Requests
 *     summary: 요청 상태를 업데이트합니다
 *     description: 요청 ID를 기반으로 요청 상태를 업데이트합니다
 *     operationId: updateRequestStatus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 요청 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, failed]
 *                 description: 새로운 요청 상태
 *     responses:
 *       200:
 *         description: 요청 상태 업데이트 성공
 */
router.patch('/:id/status', validateStatusUpdate, requestController.updateRequestStatus);

module.exports = router;