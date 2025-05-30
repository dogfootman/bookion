const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');
const Accommodation = require('./accommodation');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  accommodation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Accommodation,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity_adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  capacity_children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'KRW'
  },
  room_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  amenities: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('amenities');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('amenities', JSON.stringify(value));
    }
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  }
}, {
  tableName: 'bookion_rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 관계 설정
Room.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
Accommodation.hasMany(Room, { foreignKey: 'accommodation_id' });

module.exports = Room;
