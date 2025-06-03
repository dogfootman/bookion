const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const swaggerConfig = require('./configs/swagger');
const { errorHandler, logger } = require('./utils/errorHandler');
const { AppError } = require('./utils/errorHandler');

// 로그 디렉토리 생성
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Set sequelize as global object
global.sequelize = sequelize;

// Initialize database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 라우터 가져오기
const bookingRoutes = require('./routes/bookingRoutes');
const requestRoutes = require('./routes/requestRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const tourRoutes = require('./routes/tourRoutes');
const { router: tourApiRoutes } = require('./routes/tourApiRoutes');
const bookionRoutes = require('./routes/bookionRoutes');

// const accommodationRoutes = require('./routes/accommodationRoutes');
// const locationRoutes = require('./routes/locationRoutes');
// const apiKeyRoutes = require('./routes/apiKeyRoutes'); //

require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/v1/bookion', bookionRoutes);

// app.use('/api/v1/api-keys', apiKeyRoutes);
// app.use('/api/v1/accommodations', accommodationRoutes);
// app.use('/api/v1/locations', locationRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.redirect('/api/v1/docs');
});

// 404 처리
app.use((req, res, next) => {
  next(new AppError('Not Found', 404));
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      if (logger && typeof logger.info === 'function') {
        logger.info(`Server running on port ${port}`);
      } else {
        console.log(`Server running on port ${port}`);
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
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;