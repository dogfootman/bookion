const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

/**
 * 위치 정보 모델
 * 주소와 좌표(위도, 경도) 정보를 저장합니다.
 */
const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '전체 주소'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    comment: '위도'
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    comment: '경도'
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '지역(도/시)'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '도시(시/군/구)'
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '지역(동/읍/면)'
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '우편번호'
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'Korea',
    comment: '국가'
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
  tableName: 'bookion_locations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_lat_lng',
      fields: ['latitude', 'longitude']
    },
    {
      name: 'idx_region',
      fields: ['region']
    },
    {
      name: 'idx_city',
      fields: ['city']
    }
  ]
});

module.exports = Location;