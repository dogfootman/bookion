const { DataTypes } = require('sequelize');
const { sequelize } = global;

/**
 * 발송 이력 모델
 * 요청 결과의 발송 이력을 추적합니다.
 */
const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '요청 ID'
  },
  delivery_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '발송 유형 (email, sms)'
  },
  recipient: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '수신자'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '발송 내용'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    comment: '발송 상태 (pending, sent, failed)'
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '발송 시간'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '오류 메시지'
  }
}, {
  tableName: 'bookion_deliveries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_request_id',
      fields: ['request_id']
    },
    {
      name: 'idx_delivery_type',
      fields: ['delivery_type']
    },
    {
      name: 'idx_status',
      fields: ['status']
    }
  ]
});

module.exports = Delivery; 