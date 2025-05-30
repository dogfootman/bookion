const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticateApiKey } = require('../middlewares/apiAuth');

const router = express.Router();

// API 키 인증 적용
router.use(authenticateApiKey);

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingInput:
 *       type: object
 *       required:
 *         - room_id
 *         - check_in_date
 *         - check_out_date
 *         - adults
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         room_id:
 *           type: integer
 *           description: 객실 ID
 *         check_in_date:
 *           type: string
 *           format: date
 *           description: 체크인 날짜 (YYYY-MM-DD)
 *         check_out_date:
 *           type: string
 *           format: date
 *           description: 체크아웃 날짜 (YYYY-MM-DD)
 *         adults:
 *           type: integer
 *           description: 성인 인원 수
 *           minimum: 1
 *         children:
 *           type: integer
 *           description: 어린이 인원 수
 *           default: 0
 *         first_name:
 *           type: string
 *           description: 이름
 *         last_name:
 *           type: string
 *           description: 성
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 주소
 *         phone:
 *           type: string
 *           description: 연락처
 *         nationality:
 *           type: string
 *           description: 국적
 *         special_requests:
 *           type: string
 *           description: 특별 요청사항
 *     BookingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 예약 ID
 *         room_id:
 *           type: integer
 *           description: 객실 ID
 *         check_in_date:
 *           type: string
 *           format: date
 *           description: 체크인 날짜
 *         check_out_date:
 *           type: string
 *           format: date
 *           description: 체크아웃 날짜
 *         adults:
 *           type: integer
 *           description: 성인 인원 수
 *         children:
 *           type: integer
 *           description: 어린이 인원 수
 *         total_price:
 *           type: number
 *           description: 총 금액
 *         currency:
 *           type: string
 *           description: 통화
 *         status:
 *           type: string
 *           description: 예약 상태
 *         first_name:
 *           type: string
 *           description: 이름
 *         last_name:
 *           type: string
 *           description: 성
 *         email:
 *           type: string
 *           description: 이메일
 *         payment_status:
 *           type: string
 *           description: 결제 상태
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: 새로운 예약을 생성합니다
 *     description: 객실 예약 정보를 저장하고 예약을 확정합니다
 *     operationId: createBooking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: 예약이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /api/v1/bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: 예약 정보를 조회합니다
 *     description: 예약 ID를 기반으로 예약 상세 정보를 조회합니다
 *     operationId: getBookingById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 예약 ID
 *     responses:
 *       200:
 *         description: 예약 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /api/v1/bookings/{id}/cancel:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: 예약을 취소합니다
 *     description: 예약 ID를 기반으로 예약을 취소합니다
 *     operationId: cancelBooking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 예약 ID
 *     responses:
 *       200:
 *         description: 예약 취소 성공
 */
router.post('/:id/cancel', bookingController.cancelBooking);

/**
 * @swagger
 * /api/v1/bookings/user/{userId}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: 사용자의 모든 예약을 조회합니다
 *     description: 사용자 ID를 기반으로 모든 예약 내역을 조회합니다
 *     operationId: getUserBookings
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 예약 목록 조회 성공
 */
// router.get('/user/:userId', validateIdParam, bookingController.getUserBookings);


module.exports = router;