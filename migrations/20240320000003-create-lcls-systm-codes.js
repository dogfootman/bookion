'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lcls_systm_codes', {
      code: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        comment: '분류체계 코드'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '분류체계 이름'
      },
      rnum: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '순번'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '분류체계 레벨 (1: lclsSystm1, 2: lclsSystm2, 3: lclsSystm3)'
      },
      parent_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '상위 분류체계 코드'
      },
      lcls_systm1: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '1단계 분류체계 코드'
      },
      lcls_systm2: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '2단계 분류체계 코드'
      },
      lcls_systm3: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '3단계 분류체계 코드'
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
    await queryInterface.addIndex('lcls_systm_codes', ['level']);
    await queryInterface.addIndex('lcls_systm_codes', ['parent_code']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lcls_systm_codes');
  }
}; 