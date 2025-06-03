const { DataTypes } = require('sequelize');
const { sequelize } = global;
const Location = require('./location');

const Accommodation = sequelize.define('Accommodation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Location,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  price_range: {
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
  },
  contact_info: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('contact_info');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('contact_info', JSON.stringify(value));
    }
  }
}, {
  tableName: 'bookion_accommodations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 관계 설정
Accommodation.belongsTo(Location, { foreignKey: 'location_id' });
Location.hasMany(Accommodation, { foreignKey: 'location_id' });

module.exports = Accommodation;
