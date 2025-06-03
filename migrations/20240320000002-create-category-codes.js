'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('category_codes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: '카테고리 코드'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '카테고리 이름'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '설명'
      },
      rnum: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '순번'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '레벨 (1, 2, 3)'
      },
      parent_code: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '상위 코드'
      },
      cat1: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '대분류 코드'
      },
      cat2: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '중분류 코드'
      },
      cat3: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '소분류 코드'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // 인덱스 추가
    await queryInterface.addIndex('category_codes', ['code']);
    await queryInterface.addIndex('category_codes', ['parent_code']);
    await queryInterface.addIndex('category_codes', ['level']);
    await queryInterface.addIndex('category_codes', ['cat1']);
    await queryInterface.addIndex('category_codes', ['cat2']);
    await queryInterface.addIndex('category_codes', ['cat3']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('category_codes');
  }
}; 