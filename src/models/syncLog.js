const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

const SyncLog = sequelize.define('SyncLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  api_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'API 이름'
  },
  total_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '전체 데이터 수'
  },
  created_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '생성된 데이터 수'
  },
  updated_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '업데이트된 데이터 수'
  },
  unchanged_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '변경되지 않은 데이터 수'
  },
  error_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '에러 발생 데이터 수'
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '에러 메시지'
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '시작 시간'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '완료 시간'
  }
}, {
  tableName: 'sync_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_api_name',
      fields: ['api_name']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      name: 'idx_started_at',
      fields: ['started_at']
    }
  ]
});

module.exports = SyncLog; 