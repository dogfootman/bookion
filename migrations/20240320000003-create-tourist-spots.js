// src/database/migrations/tour/20240320000003-create-tourist-spots.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tourist_spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '콘텐츠 ID'
      },
      content_type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '콘텐츠 타입 ID'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '제목'
      },
      addr1: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '주소'
      },
      addr2: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '상세주소'
      },
      tel: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '전화번호'
      },
      zipcode: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '우편번호'
      },
      firstimage: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '대표 이미지'
      },
      firstimage2: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '대표 이미지2'
      },
      mapx: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'X 좌표'
      },
      mapy: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Y 좌표'
      },
      cat1: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '대분류'
      },
      cat2: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '중분류'
      },
      cat3: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '소분류'
      },
      area_code: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '지역 코드'
      },
      sigungu_code: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '시군구 코드'
      },
      createdtime: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '생성 시간'
      },
      modifiedtime: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '수정 시간'
      },
      mlevel: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '지도 레벨'
      },
      cpyrht_div_cd: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '저작권 구분 코드'
      },
      l_dong_regn_cd: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '법정동 지역 코드'
      },
      l_dong_signgu_cd: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '법정동 시군구 코드'
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
    await queryInterface.addIndex('tourist_spots', ['area_code']);
    await queryInterface.addIndex('tourist_spots', ['sigungu_code']);
    await queryInterface.addIndex('tourist_spots', ['cat1']);
    await queryInterface.addIndex('tourist_spots', ['cat2']);
    await queryInterface.addIndex('tourist_spots', ['cat3']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tourist_spots');
  }
};