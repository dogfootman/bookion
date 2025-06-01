'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('category_codes', {
      code: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        comment: '카테고리 코드'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '카테고리 이름'
      },
      rnum: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '순번'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '카테고리 레벨 (1: cat1, 2: cat2, 3: cat3)'
      },
      cat1: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '대분류 코드'
      },
      cat2: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '중분류 코드'
      },
      cat3: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '소분류 코드'
      },
      parentCode: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '상위 카테고리 코드',
        field: 'parent_code'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
      }
    }, {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      comment: '카테고리 코드'
    });

    // 인덱스 생성 - 이름을 더 구체적으로 변경
    await queryInterface.addIndex('category_codes', ['level'], {
      name: 'idx_category_level'
    });
    await queryInterface.addIndex('category_codes', ['parent_code'], {
      name: 'idx_category_parent_code'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('category_codes');
  }
}; 