const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../configs/database');

class TouristSpot extends Model {}

TouristSpot.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  content_type_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  road_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  first_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  second_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  map_x: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  map_y: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cat1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cat2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cat3: {
    type: DataTypes.STRING,
    allowNull: true
  },
  area_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'area_codes',
      key: 'code'
    }
  }
}, {
  sequelize,
  modelName: 'TouristSpot',
  tableName: 'tourist_spots',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['area_code']
    },
    {
      fields: ['cat1']
    },
    {
      fields: ['content_type_id']
    }
  ]
});

module.exports = TouristSpot; 