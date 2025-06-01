const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./configs/database');
const swaggerConfig = require('./configs/swagger');
const { errorHandler, logger } = require('./utils/errorHandler');

// 로그 디렉토리 생성
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 라우터 가져오기
const bookingRoutes = require('./routes/bookingRoutes');
const requestRoutes = require('./routes/requestRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const tourRoutes = require('./routes/tourRoutes');
const tourApiRoutes = require('./routes/tourApi');

// const accommodationRoutes = require('./routes/accommodationRoutes');
// const locationRoutes = require('./routes/locationRoutes');
// const apiKeyRoutes = require('./routes/apiKeyRoutes'); //

require('dotenv').config();

// 데이터베이스 연결
connectDB();

const app = express();

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


// Swagger 문서화
app.use('/api/v1/docs', swaggerConfig.serve, swaggerConfig.setup);

// 서버 상태 확인 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API 라우트
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/tour-api', tourApiRoutes);

// app.use('/api/v1/api-keys', apiKeyRoutes);
// app.use('/api/v1/accommodations', accommodationRoutes);
// app.use('/api/v1/locations', locationRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.redirect('/api/v1/docs');
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `${req.originalUrl} 경로를 찾을 수 없습니다.`,
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  if (logger && typeof logger.info === 'function') {
    logger.info(`Server running on port ${PORT}`);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});

// 서버 종료 시 정리
process.on('SIGTERM', () => {
  if (logger && typeof logger.info === 'function') {
    logger.info('SIGTERM received. Shutting down gracefully');
  }
  server.close(() => {
    if (logger && typeof logger.info === 'function') {
      logger.info('Process terminated');
    }
    process.exit(0);
  });
});

module.exports = app;