const getModels = require('../models/tour/index');
const { AppError } = require('../utils/errorHandler');

// Use global sequelize instance
const { sequelize } = global;

/**
 * 동기화 로그를 생성합니다.
 * @param {string} apiName - API 이름
 * @param {string} status - 동기화 상태
 * @returns {Promise<Object>} 생성된 동기화 로그
 */
const createSyncLog = async (apiName, status) => {
  try {
    const { SyncLog } = await getModels();
    const syncLog = await SyncLog.create({
      api_name: apiName,
      total_count: 0,
      status: status,
      started_at: new Date()
    });
    return syncLog;
  } catch (error) {
    console.error('Error creating sync log:', error);
    throw error;
  }
};

/**
 * 동기화 로그를 업데이트합니다.
 * @param {Object} syncLog - 업데이트할 동기화 로그
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 동기화 로그
 */
const updateSyncLog = async (syncLog, updateData) => {
  try {
    await syncLog.update({
      ...updateData,
      completed_at: new Date()
    });
    return syncLog;
  } catch (error) {
    console.error('Error updating sync log:', error);
    throw error;
  }
};

module.exports = {
  createSyncLog,
  updateSyncLog
}; 