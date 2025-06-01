const { sequelize } = require('../../configs/database');
const LclsSystmCode = require('./lclsSystmCode');
const AreaCode = require('./areaCode');
const CategoryCode = require('./categoryCode');
const TouristSpot = require('./touristSpot');

const initModels = async () => {
  try {
    // 모든 모델의 초기화가 완료될 때까지 대기
    const [lclsSystmCode, areaCode, categoryCode, touristSpot] = await Promise.all([
      LclsSystmCode,
      AreaCode,
      CategoryCode,
      TouristSpot
    ]);

    // 모델 초기화 확인
    const modelStatus = {
      LclsSystmCode: {
        exists: !!lclsSystmCode,
        hasInit: !!lclsSystmCode?.init,
        hasUpsert: !!lclsSystmCode?.upsert
      },
      AreaCode: {
        exists: !!areaCode,
        hasInit: !!areaCode?.init,
        hasUpsert: !!areaCode?.upsert
      },
      CategoryCode: {
        exists: !!categoryCode,
        hasInit: !!categoryCode?.init,
        hasUpsert: !!categoryCode?.upsert
      },
      TouristSpot: {
        exists: !!touristSpot,
        hasInit: !!touristSpot?.init,
        hasUpsert: !!touristSpot?.upsert
      }
    };

    // 모든 모델이 초기화되었는지 확인
    const failedModels = Object.entries(modelStatus)
      .filter(([_, status]) => !status.exists || !status.hasInit || !status.hasUpsert)
      .map(([name, status]) => ({ name, status }));

    if (failedModels.length > 0) {
      throw new Error(`Model initialization failed: ${JSON.stringify(failedModels, null, 2)}`);
    }

    // 모델 관계 설정
    lclsSystmCode.hasMany(lclsSystmCode, {
      as: 'children',
      foreignKey: 'parent_code',
      sourceKey: 'code'
    });
    lclsSystmCode.belongsTo(lclsSystmCode, {
      as: 'parent',
      foreignKey: 'parent_code',
      targetKey: 'code'
    });

    touristSpot.belongsTo(areaCode, {
      foreignKey: 'area_code',
      targetKey: 'code'
    });
    touristSpot.belongsTo(categoryCode, {
      foreignKey: 'category_code',
      targetKey: 'code'
    });

    return {
      sequelize,
      LclsSystmCode: lclsSystmCode,
      AreaCode: areaCode,
      CategoryCode: categoryCode,
      TouristSpot: touristSpot
    };
  } catch (error) {
    console.error('Failed to initialize models:', error);
    throw error;
  }
};

// 모델 초기화가 완료될 때까지 대기하고 초기화된 모델을 export
let initializedModels = null;

const getModels = async () => {
  if (!initializedModels) {
    initializedModels = await initModels();
  }
  return initializedModels;
};

module.exports = getModels; 