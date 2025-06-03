const { Model, DataTypes } = require('sequelize');
const { sequelize } = global;

class CategoryCode extends Model {}

CategoryCode.init({
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
  modelName: 'CategoryCode',
  tableName: 'category_codes',
  timestamps: true,
  underscored: true
});

module.exports = CategoryCode; 