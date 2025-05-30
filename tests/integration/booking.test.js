const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../config/database');

// 테스트용 API 키
const API_KEY = 'default-api-key-12345';

describe('Booking API', () => {
  // 각 테스트 전에 실행
  beforeEach(async () => {
    // 필요한 경우 테스트 데이터 설정
  });

  // 각 테스트 후에 실행
  afterEach(async () => {
    // 필요한 경우 테스트 데이터 정리
  });

  // 모든 테스트 완료 후 실행
  afterAll(async () => {
    await sequelize.close();
  });

  // 예약 생성 테스트
  test('Should create a new booking', async () => {
    const bookingData = {
      room_id: 1,
      check_in_date: '2023-12-01',
      check_out_date: '2023-12-05',
      adults: 2,
      children: 0,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '010-1234-5678',
      nationality: 'Korea'
    };

    const response = await request(app)
      .post('/api/v1/bookings')
      .set('x-api-key', API_KEY)
      .send(bookingData);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.booking).toBeDefined();
    expect(response.body.data.booking.room_id).toBe(bookingData.room_id);
  });

  // 예약 조회 테스트
  test('Should get booking by ID', async () => {
    const bookingId = 1; // 존재하는 예약 ID 사용

    const response = await request(app)
      .get(`/api/v1/bookings/${bookingId}`)
      .set('x-api-key', API_KEY);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.booking).toBeDefined();
    expect(response.body.data.booking.id).toBe(bookingId);
  });

  // 예약 취소 테스트
  test('Should cancel a booking', async () => {
    const bookingId = 1; // 존재하는 예약 ID 사용

    const response = await request(app)
      .post(`/api/v1/bookings/${bookingId}/cancel`)
      .set('x-api-key', API_KEY);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.booking.status).toBe('cancelled');
  });

  // 사용자 예약 목록 조회 테스트
  test('Should get user bookings', async () => {
    const userId = 1; // 존재하는 사용자 ID 사용

    const response = await request(app)
      .get(`/api/v1/bookings/user/${userId}`)
      .set('x-api-key', API_KEY);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.bookings)).toBe(true);
  });
});