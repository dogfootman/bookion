const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

/**
 * 검증 결과를 확인하고 오류가 있으면 처리합니다.
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

/**
 * 예약 요청 검증 미들웨어
 */
exports.validateBooking = [
  body('room_id').isInt().withMessage('유효한 객실 ID가 필요합니다.'),
  body('check_in_date').isDate().withMessage('유효한 체크인 날짜가 필요합니다.'),
  body('check_out_date').isDate().withMessage('유효한 체크아웃 날짜가 필요합니다.'),
  body('adults').isInt({ min: 1 }).withMessage('최소 1명의 성인이 필요합니다.'),
  body('children').optional().isInt({ min: 0 }).withMessage('어린이 수는 0 이상이어야 합니다.'),
  body('first_name').notEmpty().withMessage('이름이 필요합니다.'),
  body('last_name').notEmpty().withMessage('성이 필요합니다.'),
  body('email').isEmail().withMessage('유효한 이메일 주소가 필요합니다.'),
  body('phone').optional().isMobilePhone().withMessage('유효한 전화번호가 필요합니다.'),
  body('nationality').optional().isString().withMessage('유효한 국적이 필요합니다.'),
  validateResult
];

/**
 * 여행 정보 요청 검증 미들웨어
 */
exports.validateRequest = [
  body('request_text').notEmpty().withMessage('요청 내용이 필요합니다.'),
  body('request_type').notEmpty().withMessage('요청 유형이 필요합니다.'),
  body('check_in_date').optional().isDate().withMessage('유효한 체크인 날짜가 필요합니다.'),
  body('check_out_date').optional().isDate().withMessage('유효한 체크아웃 날짜가 필요합니다.'),
  body('adults').optional().isInt({ min: 1 }).withMessage('성인 수는 1 이상이어야 합니다.'),
  body('children').optional().isInt({ min: 0 }).withMessage('어린이 수는 0 이상이어야 합니다.'),
  body('email').optional().isEmail().withMessage('유효한 이메일 주소가 필요합니다.'),
  body('destination').optional().isString().withMessage('유효한 목적지가 필요합니다.'),
  body('first_name').optional().isString().withMessage('유효한 이름이 필요합니다.'),
  body('last_name').optional().isString().withMessage('유효한 성이 필요합니다.'),
  validateResult
];

/**
 * ID 파라미터 검증 미들웨어
 */
exports.validateIdParam = [
  param('id').isInt().withMessage('유효한 ID가 필요합니다.'),
  validateResult
];

/**
 * 상태 업데이트 검증 미들웨어
 */
exports.validateStatusUpdate = [
  param('id').isInt().withMessage('유효한 ID가 필요합니다.'),
  body('status').isIn(['pending', 'processing', 'completed', 'failed'])
    .withMessage('유효한 상태 값이 필요합니다 (pending, processing, completed, failed).'),
  validateResult
];

/**
 * 페이지네이션 쿼리 검증 미들웨어
 */
exports.validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('페이지는 1 이상이어야 합니다.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('한 페이지당 항목 수는 1~100 사이여야 합니다.'),
  validateResult
];