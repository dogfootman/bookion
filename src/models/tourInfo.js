const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

/**
 * 관광 정보 모델
 * 한국관광공사 Tour API에서 조회한 관광 정보를 저장합니다.
 */
const TourInfo = sequelize.define('TourInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '관련 요청 ID'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '관광지/시설 이름'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '상세 설명'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '위치 정보 (지역명)'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '주소'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    comment: '위도'
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    comment: '경도'
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '위치 정보 ID (Location 모델 참조)'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '카테고리 (관광지, 문화시설, 축제행사, 레포츠, 숙박, 쇼핑, 음식점 등)'
  },
  tour_api_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Tour API에서의 콘텐츠 ID'
  },
  content_type_id: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Tour API에서의 콘텐츠 타입 ID'
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '대표 이미지 URL'
  },
  thumbnail_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '썸네일 이미지 URL'
  },
  tel: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '전화번호'
  },
  homepage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '홈페이지 URL'
  },
  open_time: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '운영 시간'
  },
  rest_date: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '휴무일'
  },
  admission_fee: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '입장료'
  },
  score: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    comment: '평점 (0.0 ~ 5.0)'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '가격 정보'
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'KRW',
    comment: '통화 단위'
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '관련 키워드 (쉼표로 구분)'
  },
  ai_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI가 생성한 요약 정보'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'bookion_tour_info',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_request_id',
      fields: ['request_id']
    },
    {
      name: 'idx_tour_api_id',
      fields: ['tour_api_id']
    },
    {
      name: 'idx_category',
      fields: ['category']
    },
    {
      name: 'idx_location',
      fields: ['location']
    }
  ]
});

module.exports = TourInfo;
