'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sync_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      api_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '동기화한 API 이름'
      },
      total_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '전체 데이터 수'
      },
      created_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '새로 생성된 데이터 수'
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
        comment: '오류 발생한 데이터 수'
      },
      status: {
        type: Sequelize.ENUM('success', 'error', 'in_progress', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'in_progress'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '오류 메시지'
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '동기화 시작 시간'
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '동기화 완료 시간'
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
    await queryInterface.addIndex('sync_logs', ['api_name']);
    await queryInterface.addIndex('sync_logs', ['status']);
    await queryInterface.addIndex('sync_logs', ['started_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sync_logs');
  }
}; 