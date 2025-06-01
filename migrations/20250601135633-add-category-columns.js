'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 이미 컬럼이 존재하므로 중복 추가 방지
    // await queryInterface.addColumn('category_codes', 'cat1', {
    //   type: Sequelize.STRING(20),
    //   allowNull: true,
    //   comment: '대분류 코드'
    // });

    // await queryInterface.addColumn('category_codes', 'cat2', {
    //   type: Sequelize.STRING(20),
    //   allowNull: true,
    //   comment: '중분류 코드'
    // });

    // await queryInterface.addColumn('category_codes', 'cat3', {
    //   type: Sequelize.STRING(20),
    //   allowNull: true,
    //   comment: '소분류 코드'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('category_codes', 'cat1');
    await queryInterface.removeColumn('category_codes', 'cat2');
    await queryInterface.removeColumn('category_codes', 'cat3');
  }
};
