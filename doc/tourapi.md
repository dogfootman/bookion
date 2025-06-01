
required
 - numOfRows
 - MobileOS
 - MobileApp
 - _type = json
 - serviceKey = 9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D

serviceKey는 이미 인코딩 되어있는 값이므로 추가로 인코딩이 필요없다.

 response 결과에는 다음 3가지 항목이 있다. 가져온 결과가 totalcount가 될 때까지 모두 가져도도록
 "numOfRows": 100,
 "pageNo": 1,
 "totalCount": 17

option
 - areaCode

### 
1. areaCode2 : 지역코드목록을 지역,시군구 코드목록을 조회하는 기능입니다.
https://apis.data.go.kr/B551011/KorService2/areaCode2?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=book&_type=json&serviceKey=9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D


 - areaCode :

{
    "response": {
        "header": {
            "resultCode": "0000",
            "resultMsg": "OK"
        },
        "body": {
            "items": {
                "item": [
                    {
                        "rnum": 1,
                        "code": "1",
                        "name": "서울"
                    },
                    {
                        "rnum": 2,
                        "code": "2",
                        "name": "인천"
                    },
                    {
                        "rnum": 3,
                        "code": "3",
                        "name": "대전"
                    },
                    {
                        "rnum": 4,
                        "code": "4",
                        "name": "대구"
                    },
                    {
                        "rnum": 5,
                        "code": "5",
                        "name": "광주"
                    },
                    {
                        "rnum": 6,
                        "code": "6",
                        "name": "부산"
                    },
                    {
                        "rnum": 7,
                        "code": "7",
                        "name": "울산"
                    },
                    {
                        "rnum": 8,
                        "code": "8",
                        "name": "세종특별자치시"
                    },
                    {
                        "rnum": 9,
                        "code": "31",
                        "name": "경기도"
                    },
                    {
                        "rnum": 10,
                        "code": "32",
                        "name": "강원특별자치도"
                    }
                ]
            },
            "numOfRows": 10,
            "pageNo": 1,
            "totalCount": 17
        }
    }
}

2. categoryCode2 : 서비스분류코드목록을 대,중,소분류로 조회하는 기능
 https://apis.data.go.kr/B551011/KorService2/categoryCode2?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=book&serviceKey=9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D

 - contentTypeId : 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
 - cat1 : 
 - cat2 :
 - cat3 :

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<response>
    <header>
        <resultCode>0000</resultCode>
        <resultMsg>OK</resultMsg>
    </header>
    <body>
        <items>
            <item>
                <code>A01</code>
                <name>자연</name>
                <rnum>1</rnum>
            </item>
            <item>
                <code>A02</code>
                <name>인문(문화/예술/역사)</name>
                <rnum>2</rnum>
            </item>
            <item>
                <code>A03</code>
                <name>레포츠</name>
                <rnum>3</rnum>
            </item>
            <item>
                <code>A04</code>
                <name>쇼핑</name>
                <rnum>4</rnum>
            </item>
            <item>
                <code>A05</code>
                <name>음식</name>
                <rnum>5</rnum>
            </item>
            <item>
                <code>B02</code>
                <name>숙박</name>
                <rnum>6</rnum>
            </item>
            <item>
                <code>C01</code>
                <name>추천코스</name>
                <rnum>7</rnum>
            </item>
        </items>
        <numOfRows>7</numOfRows>
        <pageNo>1</pageNo>
        <totalCount>7</totalCount>
    </body>
</response>


https://apis.data.go.kr/B551011/KorService2/categoryCode2?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=book&serviceKey=9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D&cat1=A01

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<response>
    <header>
        <resultCode>0000</resultCode>
        <resultMsg>OK</resultMsg>
    </header>
    <body>
        <items>
            <item>
                <code>A0101</code>
                <name>자연관광지</name>
                <rnum>1</rnum>
            </item>
            <item>
                <code>A0102</code>
                <name>관광자원</name>
                <rnum>2</rnum>
            </item>
        </items>
        <numOfRows>2</numOfRows>
        <pageNo>1</pageNo>
        <totalCount>2</totalCount>
    </body>
</response>

3. lclsSystmCode2 : 분류체계 코드
https://apis.data.go.kr/B551011/EngService2/lclsSystmCode2?serviceKey=9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=bookion&_type=json

{
    "response": {
        "header": {
            "resultCode": "0000",
            "resultMsg": "OK"
        },
        "body": {
            "items": {
                "item": [
                    {
                        "code": "AC",
                        "name": "숙박",
                        "rnum": 1
                    },
                    {
                        "code": "C01",
                        "name": "추천코스",
                        "rnum": 2
                    },
                    {
                        "code": "EV",
                        "name": "축제/공연/행사",
                        "rnum": 3
                    },
                    {
                        "code": "EX",
                        "name": "체험관광",
                        "rnum": 4
                    },
                    {
                        "code": "FD",
                        "name": "음식",
                        "rnum": 5
                    },
                    {
                        "code": "HS",
                        "name": "역사관광",
                        "rnum": 6
                    },
                    {
                        "code": "LS",
                        "name": "레저스포츠",
                        "rnum": 7
                    },
                    {
                        "code": "NA",
                        "name": "자연관광",
                        "rnum": 8
                    },
                    {
                        "code": "SH",
                        "name": "쇼핑",
                        "rnum": 9
                    },
                    {
                        "code": "VE",
                        "name": "문화관광",
                        "rnum": 10
                    }
                ]
            },
            "numOfRows": 10,
            "pageNo": 1,
            "totalCount": 10
        }
    }
}
 - lclsSystmListYn=Y 분류체계 목록조회 여부(N:코드조회, Y:전체목록조회)
 - lclsSystm1=AC
 - lclsSystm2=AC01
 - lclsSystm3=AC010100
 {
    "response": {
        "header": {
            "resultCode": "0000",
            "resultMsg": "OK"
        },
        "body": {
            "items": {
                "item": [
                    {
                        "code": "AC010100",
                        "name": "Hotels",
                        "rnum": 1
                    }
                ]
            },
            "numOfRows": 1,
            "pageNo": 1,
            "totalCount": 1
        }
    }
}



4. areaBasedList2 : 지역기반 관광정보파라미터 타입에 따라서 제목순,수정일순,등록일순 정렬검색목록을 조회하는 기능

https://apis.data.go.kr/B551011/KorService2/areaBasedList2?numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=book&_type=json&areaCode=1&serviceKey=9hVJMQmM2L5zMYBN3WCxlVlcj0RYtaqfo%2FWnZNJ%2FIAKp%2FVyzrvY%2F0Zak1iQDEA5shCd2HCbYvoRt73wjNVJ%2Fkg%3D%3D

 - arrange : 정렬구분 (A=제목순, C=수정일순, D=생성일순) 대표이미지가반드시있는정렬(O=제목순, Q=수정일순, R=생성일순)
 - contentTypeId : 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
 - areaCode : 지역코드(지역코드조회 참고)
 - sigunguCode : 시군구코드(지역코드조회 참고, areaCode 필수입력)
 - cat1 : 대분류(서비스분류코드조회 참고)
 - cat2 : 중분류(서비스분류코드조회 참고, cat1 필수입력)
 - cat3 : 소분류(서비스분류코드조회 참고, cat1/cat2필수입력)
 - modifiedtime : 수정일(형식 :YYYYMMDD)
 - lDongRegnCd : 법정동 시도 코드(법정동코드조회 참고)
 - lDongSignguCd : 법정동 시군구 코드(법정동코드조회 참고, lDongRegnCd 필수입력)
 - lclsSystm1 : 분류체계 1Deth(분류체계코드조회 참고)
 - lclsSystm2 : 분류체계 2Deth(분류체계코드조회 참고, lclsSystm1 필수입력)
 - lclsSystm3 : 분류체계 3Deth(분류체계코드조회 참고, lclsSystm1/lclsSystm2 필수입력)

 {
    "response": {
        "header": {
            "resultCode": "0000",
            "resultMsg": "OK"
        },
        "body": {
            "items": {
                "item": [
                    {
                        "addr1": "서울특별시 강남구 언주로 608",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A05",
                        "cat2": "A0502",
                        "cat3": "A05020100",
                        "contentid": "2871024",
                        "contenttypeid": "39",
                        "createdtime": "20221019172623",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/08/2871008_image2_1.JPG",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/08/2871008_image3_1.JPG",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "127.0377755568",
                        "mapy": "37.5099674377",
                        "mlevel": "6",
                        "modifiedtime": "20250116153020",
                        "sigungucode": "1",
                        "tel": "",
                        "title": "가나돈까스의집",
                        "zipcode": "06102",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "680",
                        "lclsSystm1": "FD",
                        "lclsSystm2": "FD01",
                        "lclsSystm3": "FD010100"
                    },
                    {
                        "addr1": "서울특별시 종로구 평창30길 28",
                        "addr2": "(평창동)",
                        "areacode": "1",
                        "cat1": "A02",
                        "cat2": "A0206",
                        "cat3": "A02060500",
                        "contentid": "129854",
                        "contenttypeid": "14",
                        "createdtime": "20071106103314",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/19/1570619_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/19/1570619_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "126.9751811398",
                        "mapy": "37.6122099878",
                        "mlevel": "6",
                        "modifiedtime": "20240828180420",
                        "sigungucode": "23",
                        "tel": "",
                        "title": "가나아트센터",
                        "zipcode": "03004",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "110",
                        "lclsSystm1": "VE",
                        "lclsSystm2": "VE07",
                        "lclsSystm3": "VE070600"
                    },
                    {
                        "addr1": "서울특별시 강남구 도산대로 113(신사동)",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A04",
                        "cat2": "A0401",
                        "cat3": "A04011000",
                        "contentid": "2899721",
                        "contenttypeid": "38",
                        "createdtime": "20221101124622",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/58/2887858_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/58/2887858_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "127.0208657845",
                        "mapy": "37.5170635319",
                        "mlevel": "6",
                        "modifiedtime": "20240324152120",
                        "sigungucode": "1",
                        "tel": "",
                        "title": "가나안약국",
                        "zipcode": "06035",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "680",
                        "lclsSystm1": "SH",
                        "lclsSystm2": "SH04",
                        "lclsSystm3": "SH040300"
                    },
                    {
                        "addr1": "서울특별시 중구 남대문로 81",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A04",
                        "cat2": "A0401",
                        "cat3": "A04011000",
                        "contentid": "2928947",
                        "contenttypeid": "38",
                        "createdtime": "20221030221119",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/11/2889211_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/11/2889211_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "126.9817485525",
                        "mapy": "37.5647822864",
                        "mlevel": "6",
                        "modifiedtime": "20240323134830",
                        "sigungucode": "24",
                        "tel": "",
                        "title": "가네시 롯데본점",
                        "zipcode": "04533",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "140",
                        "lclsSystm1": "SH",
                        "lclsSystm2": "SH04",
                        "lclsSystm3": "SH040300"
                    },
                    {
                        "addr1": "서울특별시 금천구 디지털로 185 (가산동)",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A04",
                        "cat2": "A0401",
                        "cat3": "A04011000",
                        "contentid": "3306525",
                        "contenttypeid": "38",
                        "createdtime": "20240202160415",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/47/3314547_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/47/3314547_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "126.8872262708",
                        "mapy": "37.4782600918",
                        "mlevel": "6",
                        "modifiedtime": "20240621225338",
                        "sigungucode": "8",
                        "tel": "",
                        "title": "가넷옴므",
                        "zipcode": "08511",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "545",
                        "lclsSystm1": "SH",
                        "lclsSystm2": "SH04",
                        "lclsSystm3": "SH040300"
                    },
                    {
                        "addr1": "서울특별시 강남구 언주로167길 35",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A05",
                        "cat2": "A0502",
                        "cat3": "A05020400",
                        "contentid": "2869760",
                        "contenttypeid": "39",
                        "createdtime": "20221018170906",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/54/2869754_image2_1.JPG",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/54/2869754_image3_1.JPG",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "127.0302729961",
                        "mapy": "37.5264209476",
                        "mlevel": "6",
                        "modifiedtime": "20240226140148",
                        "sigungucode": "1",
                        "tel": "",
                        "title": "가담",
                        "zipcode": "06022",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "680",
                        "lclsSystm1": "FD",
                        "lclsSystm2": "FD02",
                        "lclsSystm3": "FD020100"
                    },
                    {
                        "addr1": "서울특별시 송파구 충민로 66",
                        "addr2": "",
                        "areacode": "1",
                        "cat1": "A04",
                        "cat2": "A0401",
                        "cat3": "A04011200",
                        "contentid": "732484",
                        "contenttypeid": "38",
                        "createdtime": "20090511234754",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/78/1920578_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/78/1920578_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "127.1229354097",
                        "mapy": "37.4770061292",
                        "mlevel": "6",
                        "modifiedtime": "20250404141929",
                        "sigungucode": "18",
                        "tel": "",
                        "title": "가든파이브라이프(Garden5life)",
                        "zipcode": "05838",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "710",
                        "lclsSystm1": "SH",
                        "lclsSystm2": "SH07",
                        "lclsSystm3": "SH070100"
                    },
                    {
                        "addr1": "서울특별시 송파구 송이로19길 3",
                        "addr2": "(가락동)",
                        "areacode": "1",
                        "cat1": "A05",
                        "cat2": "A0502",
                        "cat3": "A05020100",
                        "contentid": "2757617",
                        "contenttypeid": "39",
                        "createdtime": "20211015193340",
                        "firstimage": "",
                        "firstimage2": "",
                        "cpyrhtDivCd": "",
                        "mapx": "127.1217599348",
                        "mapy": "37.4975120620",
                        "mlevel": "6",
                        "modifiedtime": "20241227152052",
                        "sigungucode": "18",
                        "tel": "",
                        "title": "가락골마산아구찜",
                        "zipcode": "05714",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "710",
                        "lclsSystm1": "FD",
                        "lclsSystm2": "FD01",
                        "lclsSystm3": "FD010100"
                    },
                    {
                        "addr1": "서울특별시 송파구 송파대로28길 5",
                        "addr2": "(가락동)",
                        "areacode": "1",
                        "cat1": "B02",
                        "cat2": "B0201",
                        "cat3": "B02010100",
                        "contentid": "142785",
                        "contenttypeid": "32",
                        "createdtime": "20040426090000",
                        "firstimage": "",
                        "firstimage2": "",
                        "cpyrhtDivCd": "",
                        "mapx": "127.1166298703",
                        "mapy": "37.4966565128",
                        "mlevel": "6",
                        "modifiedtime": "20241101172817",
                        "sigungucode": "18",
                        "tel": "02-400-6641~3",
                        "title": "가락관광호텔",
                        "zipcode": "05719",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "710",
                        "lclsSystm1": "AC",
                        "lclsSystm2": "AC01",
                        "lclsSystm3": "AC010100"
                    },
                    {
                        "addr1": "서울특별시 송파구 양재대로 932",
                        "addr2": "(가락동)",
                        "areacode": "1",
                        "cat1": "A04",
                        "cat2": "A0401",
                        "cat3": "A04010200",
                        "contentid": "132215",
                        "contenttypeid": "38",
                        "createdtime": "20031117090000",
                        "firstimage": "http://tong.visitkorea.or.kr/cms/resource/84/1920584_image2_1.jpg",
                        "firstimage2": "http://tong.visitkorea.or.kr/cms/resource/84/1920584_image3_1.jpg",
                        "cpyrhtDivCd": "Type3",
                        "mapx": "127.1109831778",
                        "mapy": "37.4960925880",
                        "mlevel": "6",
                        "modifiedtime": "20240523141919",
                        "sigungucode": "18",
                        "tel": "02-3435-1000",
                        "title": "가락농수산물종합도매시장",
                        "zipcode": "05699",
                        "lDongRegnCd": "11",
                        "lDongSignguCd": "710",
                        "lclsSystm1": "SH",
                        "lclsSystm2": "SH06",
                        "lclsSystm3": "SH060200"
                    }
                ]
            },
            "numOfRows": 10,
            "pageNo": 1,
            "totalCount": 7797
        }
    }
}

