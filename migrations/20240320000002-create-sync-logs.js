'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sync_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      api_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'API 이름'
      },
      total_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '전체 데이터 수'
      },
      created_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '생성된 데이터 수'
      },
      updated_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '업데이트된 데이터 수'
      },
      unchanged_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '변경되지 않은 데이터 수'
      },
      error_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '에러 발생 데이터 수'
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '에러 메시지'
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '시작 시간'
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '완료 시간'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 인덱스 생성
    await queryInterface.addIndex('sync_logs', ['api_name'], {
      name: 'idx_api_name'
    });
    await queryInterface.addIndex('sync_logs', ['status'], {
      name: 'idx_status'
    });
    await queryInterface.addIndex('sync_logs', ['started_at'], {
      name: 'idx_started_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sync_logs');
  }
}; 