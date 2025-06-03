const { DataTypes } = require('sequelize');
const { sequelize } = global;

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  request_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  request_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  check_in_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  check_out_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  adults: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  children: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  destination: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  accommodation_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  }
}, {
  tableName: 'bookion_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Request;
