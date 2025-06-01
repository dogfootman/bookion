const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');

const AreaCode = sequelize.define('AreaCode', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    comment: '지역 코드'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '지역 이름'
  }
}, {
  tableName: 'area_codes',
  timestamps: true,
  indexes: [
    {
      name: 'idx_code',
      fields: ['code']
    }
  ]
});

const CategoryCode = sequelize.define('CategoryCode', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    comment: '카테고리 코드'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '카테고리 이름'
  },
  rnum: {
    type: DataTypes.INTEGER,
    comment: '순번'
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '카테고리 레벨 (1: cat1, 2: cat2, 3: cat3)'
  },
  parentCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '상위 카테고리 코드'
  },
  cat1: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '대분류 코드'
  },
  cat2: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '중분류 코드'
  },
  cat3: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: '소분류 코드'
  }
}, {
  tableName: 'category_codes',
  timestamps: true,
  indexes: [
    {
      name: 'idx_level',
      fields: ['level']
    },
    {
      name: 'idx_parent_code',
      fields: ['parentCode']
    }
  ]
});

module.exports = {
  AreaCode,
  CategoryCode
}; 