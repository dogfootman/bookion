'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM 타입을 VARCHAR로 변경
    await queryInterface.sequelize.query(`
      ALTER TABLE sync_logs 
      MODIFY COLUMN status VARCHAR(20) 
      NOT NULL DEFAULT 'pending'
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // VARCHAR를 다시 ENUM으로 되돌리기
    await queryInterface.sequelize.query(`
      ALTER TABLE sync_logs 
      MODIFY COLUMN status ENUM('pending', 'started', 'in_progress', 'success', 'failed', 'error') 
      NOT NULL DEFAULT 'pending'
    `);
  }
}; 