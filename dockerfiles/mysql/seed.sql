USE bookion_service;

-- 테스트 사용자 데이터
INSERT INTO bookion_users (email, first_name, last_name, password, phone, nationality) VALUES
('user1@example.com', '길동', '홍', '$2b$10$rIC/UgHSJDKzRJjg.igQzOzRpkNbp9hGa.xdzAJFs2fdEOlxP0Qbu', '010-1111-2222', 'Korea'),
('user2@example.com', '철수', '김', '$2b$10$rIC/UgHSJDKzRJjg.igQzOzRpkNbp9hGa.xdzAJFs2fdEOlxP0Qbu', '010-3333-4444', 'Korea'),
('user3@example.com', '영희', '이', '$2b$10$rIC/UgHSJDKzRJjg.igQzOzRpkNbp9hGa.xdzAJFs2fdEOlxP0Qbu', '010-5555-6666', 'Korea'),
('john@example.com', 'John', 'Doe', '$2b$10$rIC/UgHSJDKzRJjg.igQzOzRpkNbp9hGa.xdzAJFs2fdEOlxP0Qbu', '010-7777-8888', 'USA')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 테스트 위치 정보 데이터
INSERT INTO bookion_locations (address, latitude, longitude, region, city, country, postal_code) VALUES
('제주특별자치도 서귀포시 성산읍 일출로 284-12', 33.458031, 126.942520, '제주도', '서귀포시', 'Korea', '63643'),
('제주특별자치도 제주시 우도면', 33.506944, 126.951389, '제주도', '제주시', 'Korea', '63000'),
('서울특별시 종로구 사직로 161', 37.579617, 126.977041, '서울', '종로구', 'Korea', '03045'),
('부산광역시 해운대구 해운대해변로 264', 35.158795, 129.160767, '부산', '해운대구', 'Korea', '48099')
ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude);

-- 테스트 숙소 데이터
INSERT INTO bookion_accommodations (name, description, address, location_id, type, rating, price_range, amenities, images, contact_info) VALUES
('그랜드 호텔', '제주도의 아름다운 해변과 가까운 5성급 호텔', '제주특별자치도 서귀포시 중문관광로 72번길 75', 1, '호텔', 4.8, '고급', '{"wifi": true, "parking": true, "pool": true, "gym": true, "restaurant": true}', '["https://example.com/grand_hotel1.jpg", "https://example.com/grand_hotel2.jpg"]', '{"phone": "064-123-4567", "email": "info@grandhotel.com", "website": "https://www.grandhotel.com"}'),
('시티 게스트하우스', '서울 중심부에 위치한 아늑한 게스트하우스', '서울특별시 종로구 인사동길 12', 3, '게스트하우스', 4.2, '저렴', '{"wifi": true, "parking": false, "kitchen": true, "lounge": true}', '["https://example.com/city_guesthouse1.jpg", "https://example.com/city_guesthouse2.jpg"]', '{"phone": "02-123-4567", "email": "info@cityguesthouse.com", "website": "https://www.cityguesthouse.com"}'),
('해변 리조트', '해운대 해변이 보이는 럭셔리 리조트', '부산광역시 해운대구 해운대해변로 264', 4, '리조트', 4.6, '고급', '{"wifi": true, "parking": true, "pool": true, "spa": true, "beach_access": true}', '["https://example.com/beach_resort1.jpg", "https://example.com/beach_resort2.jpg"]', '{"phone": "051-123-4567", "email": "info@beachresort.com", "website": "https://www.beachresort.com"}')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 테스트 객실 데이터
INSERT INTO bookion_rooms (accommodation_id, name, description, capacity_adults, capacity_children, price_per_night, currency, room_type, amenities, images) VALUES
(1, '디럭스 더블룸', '바다 전망이 있는 넓은 더블 침대 객실', 2, 1, 250000, 'KRW', '더블', '{"tv": true, "air_conditioning": true, "minibar": true, "safe": true, "ocean_view": true}', '["https://example.com/deluxe_double1.jpg", "https://example.com/deluxe_double2.jpg"]'),
(1, '프리미엄 스위트', '넓은 거실과 킹 사이즈 침대가 있는 고급 스위트룸', 2, 2, 450000, 'KRW', '스위트', '{"tv": true, "air_conditioning": true, "minibar": true, "safe": true, "living_room": true, "jacuzzi": true}', '["https://example.com/premium_suite1.jpg", "https://example.com/premium_suite2.jpg"]'),
(2, '도미토리 침대', '4인실 도미토리 침대', 1, 0, 30000, 'KRW', '도미토리', '{"shared_bathroom": true, "locker": true, "reading_light": true}', '["https://example.com/dormitory1.jpg", "https://example.com/dormitory2.jpg"]'),
(2, '프라이빗 트윈룸', '2인용 트윈 침대 객실', 2, 0, 80000, 'KRW', '트윈', '{"tv": true, "private_bathroom": true, "desk": true}', '["https://example.com/private_twin1.jpg", "https://example.com/private_twin2.jpg"]'),
(3, '오션뷰 킹룸', '바다가 보이는 킹 사이즈 침대 객실', 2, 1, 350000, 'KRW', '킹', '{"tv": true, "air_conditioning": true, "minibar": true, "safe": true, "ocean_view": true, "balcony": true}', '["https://example.com/ocean_view_king1.jpg", "https://example.com/ocean_view_king2.jpg"]')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 테스트 요청 데이터
INSERT INTO bookion_requests (user_id, request_text, request_type, check_in_date, check_out_date, adults, children, nationality, email, destination, accommodation_type, first_name, last_name, status) VALUES
(1, '제주도에서 가볼만한 자연 관광지 추천해주세요', 'travel', '2023-06-10', '2023-06-15', 2, 0, 'Korea', 'user1@example.com', '제주도', '호텔', '길동', '홍', 'completed'),
(2, '서울에서 가족과 함께 가볼만한 곳 추천해주세요', 'travel', '2023-07-20', '2023-07-25', 2, 2, 'Korea', 'user2@example.com', '서울', '게스트하우스', '철수', '김', 'processing'),
(3, '부산에서 맛집 추천해주세요', 'food', '2023-08-05', '2023-08-10', 2, 0, 'Korea', 'user3@example.com', '부산', '리조트', '영희', '이', 'pending'),
(4, 'Looking for historical places in Seoul', 'travel', '2023-09-15', '2023-09-20', 2, 0, 'USA', 'john@example.com', 'Seoul', 'Hotel', 'John', 'Doe', 'pending')
ON DUPLICATE KEY UPDATE request_text = VALUES(request_text);

-- 테스트 관광 정보 데이터
INSERT INTO bookion_tour_info (request_id, title, content, location, address, latitude, longitude, category, tour_api_id, image_url, price, currency) VALUES
(1, '성산일출봉', '제주도의 대표적인 자연 명소로, 유네스코 세계자연유산으로 등재되어 있습니다.', '제주도', '제주특별자치도 서귀포시 성산읍 일출로 284-12', 33.458031, 126.942520, '관광지', '123456', 'https://example.com/images/seongsan.jpg', 5000, 'KRW'),
(1, '우도', '제주도 동쪽에 위치한 작은 섬으로, 아름다운 해변과 경치로 유명합니다.', '제주도', '제주특별자치도 제주시 우도면', 33.506944, 126.951389, '관광지', '123457', 'https://example.com/images/udo.jpg', 8500, 'KRW'),
(2, '경복궁', '조선 왕조의 법궁으로, 서울의 대표적인 문화유산입니다.', '서울', '서울특별시 종로구 사직로 161', 37.579617, 126.977041, '문화시설', '123458', 'https://example.com/images/gyeongbokgung.jpg', 3000, 'KRW')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 테스트 예약 데이터
INSERT INTO bookion_bookings (user_id, room_id, check_in_date, check_out_date, adults, children, total_price, currency, status, special_requests, first_name, last_name, email, phone, nationality, payment_status) VALUES
(1, 1, '2023-06-10', '2023-06-15', 2, 0, 1250000, 'KRW', 'confirmed', '늦은 체크인 예정입니다.', '길동', '홍', 'user1@example.com', '010-1111-2222', 'Korea', 'paid'),
(2, 4, '2023-07-20', '2023-07-25', 2, 2, 400000, 'KRW', 'confirmed', '아이들을 위한 추가 침구가 필요합니다.', '철수', '김', 'user2@example.com', '010-3333-4444', 'Korea', 'pending'),
(3, 5, '2023-08-05', '2023-08-10', 2, 0, 1750000, 'KRW', 'confirmed', '조용한 객실을 원합니다.', '영희', '이', 'user3@example.com', '010-5555-6666', 'Korea', 'paid'),
(4, 1, '2023-09-15', '2023-09-20', 2, 0, 1250000, 'KRW', 'confirmed', 'Early check-in if possible.', 'John', 'Doe', 'john@example.com', '010-7777-8888', 'USA', 'paid')
ON DUPLICATE KEY UPDATE check_in_date = VALUES(check_in_date);

-- 테스트 리뷰 데이터
INSERT INTO bookion_reviews (user_id, booking_id, accommodation_id, rating, comment, images, status) VALUES
(1, 1, 1, 4.5, '훌륭한 호텔이었습니다. 객실도 깨끗하고 직원들도 친절했어요. 특히 아침 식사가 정말 맛있었습니다.', '["https://example.com/review_image1.jpg", "https://example.com/review_image2.jpg"]', 'published'),
(2, 2, 2, 3.8, '위치가 좋고 가격 대비 만족스러웠습니다. 하지만 소음이 조금 있었어요.', '["https://example.com/review_image3.jpg"]', 'published'),
(3, 3, 3, 5.0, '최고의 리조트였습니다! 해변 뷰가 정말 아름답고, 모든 시설이 완벽했어요. 꼭 다시 방문하고 싶습니다.', '[]', 'published'),
(4, 4, 1, 4.2, 'Great location and service. The staff was very helpful with providing local information.', '["https://example.com/review_image4.jpg"]', 'published')
ON DUPLICATE KEY UPDATE rating = VALUES(rating);

-- 테스트 발송 이력 데이터
INSERT INTO bookion_deliveries (request_id, delivery_type, recipient, content, status, sent_at) VALUES
(1, 'email', 'user1@example.com', '제주도 여행 정보를 안내해 드립니다. 성산일출봉과 우도는 꼭 방문해 보세요.', 'sent', '2023-05-24 10:30:00'),
(2, 'email', 'user2@example.com', '서울 여행 정보를 안내해 드립니다. 경복궁, 남산타워, 인사동은 가족 여행으로 적합합니다.', 'pending', NULL),
(3, 'sms', '010-5555-6666', '부산 맛집 정보가 준비되었습니다. 이메일을 확인해 주세요.', 'pending', NULL),
(4, 'email', 'john@example.com', 'Here is information about historical places in Seoul: Gyeongbokgung Palace, Changdeokgung Palace, and Bukchon Hanok Village.', 'sent', '2023-05-25 15:45:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);
