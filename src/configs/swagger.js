const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 정의
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '여행 정보 제공 서비스 API',
      version: '1.0.0',
      description: '사용자의 여행 정보 요청을 처리하여 AI 분석과 Tour API 통합을 통해 맞춤형 여행 정보를 제공하는 서비스 API',
      contact: {
        name: '개발팀',
        email: 'dev@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: '개발 서버'
      },
      {
        url: 'https://api.example.com/api/v1',
        description: '운영 서버'
      }
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API 키를 헤더에 제공하세요'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        apiKey: []
      }
    ]
  },
  // API 경로 패턴으로 JSDoc 주석이 포함된 파일을 지정합니다.
  apis: ['./src/routes/*.js', './src/models/*.js']
};

// Swagger 스펙 생성
const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
  })
};