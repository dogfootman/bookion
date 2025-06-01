// src/database/migrations/tour/20240320000003-create-tourist-spots.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tourist_spots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      content_type_id: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      addr1: {
        type: Sequelize.STRING(200)
      },
      addr2: {
        type: Sequelize.STRING(200)
      },
      area_code: {
        type: Sequelize.STRING(10),
        references: {
          model: 'area_codes',
          key: 'code'
        }
      },
      sigungu_code: {
        type: Sequelize.STRING(10)
      },
      cat1: {
        type: Sequelize.STRING(10),
        references: {
          model: 'category_codes',
          key: 'code'
        }
      },
      cat2: {
        type: Sequelize.STRING(10)
      },
      cat3: {
        type: Sequelize.STRING(10)
      },
      first_image: {
        type: Sequelize.STRING(500)
      },
      first_image2: {
        type: Sequelize.STRING(500)
      },
      mapx: {
        type: Sequelize.DECIMAL(20, 16)
      },
      mapy: {
        type: Sequelize.DECIMAL(20, 16)
      },
      tel: {
        type: Sequelize.STRING(50)
      },
      zipcode: {
        type: Sequelize.STRING(10)
      },
      created_time: {
        type: Sequelize.STRING(14)
      },
      modified_time: {
        type: Sequelize.STRING(14)
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 인덱스 생성
    await queryInterface.addIndex('tourist_spots', ['area_code']);
    await queryInterface.addIndex('tourist_spots', ['cat1']);
    await queryInterface.addIndex('tourist_spots', ['content_type_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tourist_spots');
  }
};