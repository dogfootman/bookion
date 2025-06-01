const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../configs/database');

class AreaCode extends Model {}

AreaCode.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'AreaCode',
  tableName: 'area_codes',
  timestamps: true,
  underscored: true
});

module.exports = AreaCode; 