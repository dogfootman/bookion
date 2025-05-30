const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

/**
 * 임시 사용자 모델
 * 로그인 없이도 서비스를 이용할 수 있으며, 요청 시 제공된 정보로 임시 사용자 생성
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  device_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '사용자 기기 식별자'
  },
  session_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '세션 식별자'
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
  tableName: 'bookion_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
