const express = require('express');
const router = express.Router();
const tourApiController = require('../controllers/tourApiController');
const TOUR_API_CONFIG = require('../configs/tourApi');

/**
 * @swagger
 * /api/v1/tour-api/sync/area-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 지역 코드 동기화
 *     description: Tour API에서 지역 코드를 가져와 데이터베이스에 저장합니다.
 *     responses:
 *       200:
 *         description: 동기화 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/sync/area-codes', tourApiController.syncAreaCodes);

/**
 * @swagger
 * /api/v1/tour-api/sync/category-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 카테고리 코드 동기화
 *     description: Tour API에서 카테고리 코드를 가져와 데이터베이스에 저장합니다.
 *     responses:
 *       200:
 *         description: 동기화 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/sync/category-codes', tourApiController.syncCategoryCodes);

/**
 * @swagger
 * /api/v1/tour-api/sync/lcls-systm-codes:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 분류체계 코드 동기화
 *     description: Tour API에서 분류체계 코드를 가져와 데이터베이스에 저장합니다.
 *     responses:
 *       200:
 *         description: 동기화 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/sync/lcls-systm-codes', tourApiController.syncLclsSystmCodes);

/**
 * @swagger
 * /api/v1/tour-api/sync/area-based-list2/immediate:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 지역기반 관광정보 동기화 (즉시)
 *     description: 특정 지역의 관광정보를 동기화하고 결과를 즉시 반환합니다.
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
router.post('/sync/area-based-list2/immediate', tourApiController.areaBasedList2Sync);

/**
 * @swagger
 * /api/v1/tour-api/sync/area-based-list2/background:
 *   post:
 *     tags:
 *       - Tour API
 *     summary: 지역기반 관광정보 동기화 (백그라운드)
 *     description: 모든 지역의 관광정보를 백그라운드에서 동기화하고 작업 ID를 반환합니다.
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
 *         description: 동기화 작업 시작
 *       500:
 *         description: 서버 오류
 */
router.post('/sync/area-based-list2/background', tourApiController.areaBasedList2Async);

/**
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
router.get('/sync/area-based-list2/status/:syncLogId', tourApiController.getAreaBasedList2SyncStatus);

module.exports = {
  router,
  TOUR_API_CONFIG
}; 