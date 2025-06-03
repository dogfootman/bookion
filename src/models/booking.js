const { DataTypes } = require('sequelize');
const { sequelize } = global;
const User = require('./user');
const Room = require('./room');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    }
  },
  check_in_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  check_out_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'KRW'
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'confirmed'
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  }
}, {
  tableName: 'bookion_bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 관계 설정
Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Room, { foreignKey: 'room_id' });

module.exports = Booking;
