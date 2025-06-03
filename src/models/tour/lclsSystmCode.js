const { Model, DataTypes } = require('sequelize');
const { sequelize } = global;

console.log('Initializing LclsSystmCode model...');

class LclsSystmCode extends Model {}

const initModel = async () => {
  try {
    await LclsSystmCode.init({
      code: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        comment: '분류체계 코드'
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '분류체계 이름'
      },
      rnum: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '순번'
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '분류체계 레벨 (1: lclsSystm1, 2: lclsSystm2, 3: lclsSystm3)'
      },
      parent_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '상위 분류체계 코드'
      },
      lcls_systm1: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '1단계 분류체계 코드'
      },
      lcls_systm2: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '2단계 분류체계 코드'
      },
      lcls_systm3: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '3단계 분류체계 코드'
      }
    }, {
      sequelize,
      modelName: 'LclsSystmCode',
      tableName: 'lcls_systm_codes',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_lcls_level',
          fields: ['level']
        },
        {
          name: 'idx_lcls_parent_code',
          fields: ['parent_code']
        }
      ]
    });

    console.log('LclsSystmCode model initialized successfully:', {
      exists: !!LclsSystmCode,
      hasInit: !!LclsSystmCode.init,
      hasUpsert: !!LclsSystmCode.upsert,
      prototype: Object.getPrototypeOf(LclsSystmCode)
    });

    return LclsSystmCode;
  } catch (error) {
    console.error('Failed to initialize LclsSystmCode model:', error);
    throw error;
  }
};

module.exports = initModel(); 