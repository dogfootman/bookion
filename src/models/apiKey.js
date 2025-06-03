const { DataTypes } = require('sequelize');
const { sequelize } = global;
const crypto = require('crypto');

/**
 * API 키 모델
 * 외부 클라이언트가 API에 접근하기 위한 인증 키를 관리합니다.
 */
const ApiKey = sequelize.define('ApiKey', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  client_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '클라이언트 이름'
  },
  api_key: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: 'API 키'
  },
  secret_key: {
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: 'API 시크릿 키'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '활성화 여부'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '만료 일시'
  },
  rate_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: '시간당 허용 요청 수'
  },
  allowed_ips: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '허용된 IP 목록 (쉼표로 구분)'
  },
  last_used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '마지막 사용 시간'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '생성자 ID'
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
  tableName: 'bookion_api_keys',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (apiKey) => {
      if (!apiKey.api_key) {
        apiKey.api_key = crypto.randomBytes(32).toString('hex');
      }
      if (!apiKey.secret_key) {
        apiKey.secret_key = crypto.randomBytes(32).toString('hex');
      }
      if (!apiKey.expires_at) {
        // 기본적으로 1년 후 만료
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        apiKey.expires_at = oneYearLater;
      }
    }
  }
});

module.exports = ApiKey;
