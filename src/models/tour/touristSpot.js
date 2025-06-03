const { Model, DataTypes } = require('sequelize');
const { sequelize } = global;

class TouristSpot extends Model {}

TouristSpot.init({
  contentId: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: 'content_id',
    comment: '콘텐츠 ID'
  },
  contentTypeId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'content_type_id',
    comment: '콘텐츠 타입 ID'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '제목'
  },
  addr1: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '주소'
  },
  addr2: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '상세주소'
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '전화번호'
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '우편번호'
  },
  firstimage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '대표 이미지'
  },
  firstimage2: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '두 번째 이미지'
  },
  mapx: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'X 좌표'
  },
  mapy: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Y 좌표'
  },
  cat1: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '대분류'
  },
  cat2: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '중분류'
  },
  cat3: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '소분류'
  },
  areaCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'area_code',
    comment: '지역 코드'
  },
  sigunguCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'sigungu_code',
    comment: '시군구 코드'
  },
  createdtime: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '생성 시간'
  },
  modifiedtime: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '수정 시간'
  },
  mlevel: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '지도 레벨'
  },
  cpyrhtDivCd: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'cpyrht_div_cd',
    comment: '저작권 구분 코드'
  },
  lDongRegnCd: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'l_dong_regn_cd',
    comment: '법정동 지역 코드'
  },
  lDongSignguCd: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'l_dong_signgu_cd',
    comment: '법정동 시군구 코드'
  },
  lclsSystm1: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'lcls_systm1',
    comment: '1단계 분류체계 코드'
  },
  lclsSystm2: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'lcls_systm2',
    comment: '2단계 분류체계 코드'
  },
  lclsSystm3: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'lcls_systm3',
    comment: '3단계 분류체계 코드'
  }
}, {
  sequelize,
  modelName: 'TouristSpot',
  tableName: 'tourist_spots',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_area_code',
      fields: ['area_code']
    },
    {
      name: 'idx_sigungu_code',
      fields: ['sigungu_code']
    },
    {
      name: 'idx_cat1',
      fields: ['cat1']
    },
    {
      name: 'idx_cat2',
      fields: ['cat2']
    },
    {
      name: 'idx_cat3',
      fields: ['cat3']
    }
  ]
});

module.exports = TouristSpot; 