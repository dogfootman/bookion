'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 기존 ENUM 타입을 새로운 값으로 업데이트
    await queryInterface.sequelize.query(`
      ALTER TABLE sync_logs 
      MODIFY COLUMN status ENUM('pending', 'started', 'in_progress', 'success', 'failed', 'error') 
      NOT NULL DEFAULT 'pending'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // 이전 ENUM 타입으로 되돌리기
    await queryInterface.sequelize.query(`
      ALTER TABLE sync_logs 
      MODIFY COLUMN status ENUM('pending', 'started', 'success', 'error') 
      NOT NULL DEFAULT 'pending'
    `);
  }
}; 