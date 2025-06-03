'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lcls_systm_codes', {
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
        comment: '대분류 코드'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '대분류 이름'
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
        comment: '레벨 (1, 2, 3)'
      },
      parent_code: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '상위 코드'
      },
      lcls_systm1: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '1단계 분류체계 코드'
      },
      lcls_systm2: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '2단계 분류체계 코드'
      },
      lcls_systm3: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '3단계 분류체계 코드'
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
    await queryInterface.addIndex('lcls_systm_codes', ['code']);
    await queryInterface.addIndex('lcls_systm_codes', ['parent_code']);
    await queryInterface.addIndex('lcls_systm_codes', ['level']);
    await queryInterface.addIndex('lcls_systm_codes', ['lcls_systm1']);
    await queryInterface.addIndex('lcls_systm_codes', ['lcls_systm2']);
    await queryInterface.addIndex('lcls_systm_codes', ['lcls_systm3']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lcls_systm_codes');
  }
}; 