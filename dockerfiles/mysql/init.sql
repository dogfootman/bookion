-- 데이터베이스가 없으면 생성
CREATE DATABASE IF NOT EXISTS bookion_service;
USE bookion_service;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS bookion_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nationality VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API 키 테이블
CREATE TABLE IF NOT EXISTS bookion_api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  api_key VARCHAR(64) NOT NULL UNIQUE,
  secret_key VARCHAR(64) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME NOT NULL,
  rate_limit INT DEFAULT 100 COMMENT '시간당 허용 요청 수',
  allowed_ips TEXT COMMENT '허용된 IP 목록 (쉼표로 구분)',
  last_used_at DATETIME,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_api_key (api_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 여행 요청 테이블
CREATE TABLE IF NOT EXISTS bookion_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  request_text TEXT NOT NULL,
  request_type VARCHAR(50) NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  nationality VARCHAR(50),
  email VARCHAR(100),
  destination VARCHAR(255),
  accommodation_type VARCHAR(100),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_destination (destination),
  FOREIGN KEY (user_id) REFERENCES bookion_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 관광 정보 테이블
CREATE TABLE IF NOT EXISTS bookion_tour_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  location VARCHAR(255),
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category VARCHAR(100),
  tour_api_id VARCHAR(100),
  image_url TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'KRW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES bookion_requests(id) ON DELETE CASCADE,
  INDEX idx_tour_api_id (tour_api_id),
  INDEX idx_location (location),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 위치 정보 테이블
CREATE TABLE IF NOT EXISTS bookion_locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  region VARCHAR(100),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lat_lng (latitude, longitude),
  INDEX idx_region (region),
  INDEX idx_city (city),
  INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 발송 이력 테이블
CREATE TABLE IF NOT EXISTS bookion_deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  delivery_type ENUM('email', 'sms') NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES bookion_requests(id) ON DELETE CASCADE,
  INDEX idx_delivery_type (delivery_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 숙소 테이블
CREATE TABLE IF NOT EXISTS bookion_accommodations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  location_id INT,
  type VARCHAR(50) NOT NULL COMMENT '호텔, 리조트, 게스트하우스 등',
  rating DECIMAL(3, 2),
  price_range VARCHAR(50),
  amenities TEXT COMMENT '제공 시설 (JSON 형식)',
  images TEXT COMMENT '이미지 URL (JSON 형식)',
  contact_info TEXT COMMENT '연락처 정보 (JSON 형식)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES bookion_locations(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_type (type),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 객실 테이블
CREATE TABLE IF NOT EXISTS bookion_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  accommodation_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  capacity_adults INT NOT NULL DEFAULT 1,
  capacity_children INT NOT NULL DEFAULT 0,
  price_per_night DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'KRW',
  room_type VARCHAR(50) COMMENT '싱글, 더블, 스위트 등',
  amenities TEXT COMMENT '객실 시설 (JSON 형식)',
  images TEXT COMMENT '객실 이미지 URL (JSON 형식)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (accommodation_id) REFERENCES bookion_accommodations(id) ON DELETE CASCADE,
  INDEX idx_room_type (room_type),
  INDEX idx_capacity (capacity_adults, capacity_children)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 예약 테이블
CREATE TABLE IF NOT EXISTS bookion_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  room_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INT NOT NULL DEFAULT 1,
  children INT NOT NULL DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'KRW',
  status VARCHAR(20) DEFAULT 'confirmed' COMMENT 'confirmed, cancelled, completed',
  special_requests TEXT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  nationality VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES bookion_users(id) ON DELETE SET NULL,
  FOREIGN KEY (room_id) REFERENCES bookion_rooms(id) ON DELETE CASCADE,
  INDEX idx_check_in (check_in_date),
  INDEX idx_check_out (check_out_date),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 지역 카테고리 테이블
CREATE TABLE IF NOT EXISTS bookion_region_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  parent_code VARCHAR(10),
  level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_parent_code (parent_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 관광 카테고리 테이블
CREATE TABLE IF NOT EXISTS bookion_tour_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  parent_code VARCHAR(10),
  level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_parent_code (parent_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 시스템 설정 테이블
CREATE TABLE IF NOT EXISTS bookion_system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS bookion_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  booking_id INT,
  accommodation_id INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  comment TEXT,
  images TEXT COMMENT '리뷰 이미지 URL (JSON 형식)',
  status VARCHAR(20) DEFAULT 'published' COMMENT 'published, hidden, flagged',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES bookion_users(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES bookion_bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (accommodation_id) REFERENCES bookion_accommodations(id) ON DELETE CASCADE,
  INDEX idx_rating (rating),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 관리자 사용자 추가
INSERT INTO bookion_users (email, first_name, last_name, password, phone, nationality) VALUES
('admin@example.com', 'Admin', 'User', '$2b$10$rIC/UgHSJDKzRJjg.igQzOzRpkNbp9hGa.xdzAJFs2fdEOlxP0Qbu', '010-1234-5678', 'Korea')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- 초기 API 키 추가
INSERT INTO bookion_api_keys (client_name, api_key, secret_key, expires_at, rate_limit, created_by) VALUES
('Default Client', 'default-api-key-12345', 'default-secret-key-67890', DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 YEAR), 100, 1)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- 지역 카테고리 초기 데이터
INSERT INTO bookion_region_categories (code, name, parent_code, level) VALUES
('1', '서울', NULL, 1),
('2', '인천', NULL, 1),
('3', '대전', NULL, 1),
('4', '대구', NULL, 1),
('5', '광주', NULL, 1),
('6', '부산', NULL, 1),
('7', '울산', NULL, 1),
('8', '세종', NULL, 1),
('31', '경기도', NULL, 1),
('32', '강원도', NULL, 1),
('33', '충청북도', NULL, 1),
('34', '충청남도', NULL, 1),
('35', '경상북도', NULL, 1),
('36', '경상남도', NULL, 1),
('37', '전라북도', NULL, 1),
('38', '전라남도', NULL, 1),
('39', '제주도', NULL, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 관광 카테고리 초기 데이터
INSERT INTO bookion_tour_categories (code, name, parent_code, level) VALUES
('12', '관광지', NULL, 1),
('14', '문화시설', NULL, 1),
('15', '축제행사', NULL, 1),
('28', '레포츠', NULL, 1),
('32', '숙박', NULL, 1),
('38', '쇼핑', NULL, 1),
('39', '음식점', NULL, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 시스템 설정 초기 데이터
INSERT INTO bookion_system_settings (setting_key, setting_value, description) VALUES
('email_template_request', '<h1>여행 정보 요청이 접수되었습니다</h1><p>요청 내용: {{requestText}}</p><p>처리가 완료되면 다시 연락드리겠습니다.</p>', '요청 접수 이메일 템플릿'),
('email_template_result', '<h1>여행 정보 요청 결과</h1><p>요청하신 내용에 대한 정보입니다:</p>{{resultContent}}', '요청 결과 이메일 템플릿'),
('sms_template_request', '[여행 정보] 요청이 접수되었습니다. 처리가 완료되면 다시 안내해 드리겠습니다.', '요청 접수 SMS 템플릿'),
('sms_template_result', '[여행 정보] 요청하신 정보가 준비되었습니다. 자세한 내용은 이메일을 확인해 주세요.', '요청 결과 SMS 템플릿'),
('default_rate_limit', '100', '기본 API 요청 제한 (시간당)'),
('api_key_expiry_days', '365', 'API 키 기본 유효 기간 (일)'),
('booking_confirmation_email', '<h1>예약이 확정되었습니다</h1><p>{{first_name}} {{last_name}}님, 예약이 확정되었습니다.</p><p>체크인: {{check_in_date}}</p><p>체크아웃: {{check_out_date}}</p><p>숙소: {{accommodation_name}}</p><p>객실: {{room_name}}</p><p>총 요금: {{total_price}} {{currency}}</p>', '예약 확정 이메일 템플릿')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;