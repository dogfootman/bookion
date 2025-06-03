const { DataTypes } = require('sequelize');
const { sequelize } = global;

/**
 * 시스템 설정 모델
 * 시스템 전반에 걸쳐 사용되는 설정값들을 저장합니다.
 */
const SystemSettings = sequelize.define('SystemSettings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  setting_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '설정 키'
  },
  setting_value: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '설정 값'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '설정 설명'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '설정 카테고리'
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '공개 여부'
  }
}, {
  tableName: 'bookion_system_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_setting_key',
      fields: ['setting_key']
    },
    {
      name: 'idx_category',
      fields: ['category']
    }
  ]
});

module.exports = SystemSettings;