-- ============================================
-- CITIZEN LOOP - Database Initialization
-- ============================================
-- This script creates tables and seeds demo data

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('CITIZEN', 'ADMIN') DEFAULT 'CITIZEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  complaint_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category ENUM('WASTE', 'WATER', 'ROAD', 'STREETLIGHT', 'HAZARD') NOT NULL,
  status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'PENDING',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url VARCHAR(500),
  sdg_goal VARCHAR(100),
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_user_id (user_id),
  INDEX idx_complaint_id (complaint_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Demo Admin User
-- Password: admin1234 (BCrypt encoded)
INSERT IGNORE INTO users (name, email, password, role) VALUES 
(
  'Admin User',
  'admin@example.com',
  '$2a$10$slYQmyNdGzin7olVN3p5K.0VvRfIsWDBKWHaGKbPEGrKvEwC5tJAO',
  'ADMIN'
);

-- Insert Demo Citizen User
-- Password: demo1234 (BCrypt encoded)
INSERT IGNORE INTO users (name, email, password, role) VALUES 
(
  'Demo Citizen',
  'citizen@example.com',
  '$2a$10$dXJ3ERSf/8/Z3h1K2m1l2OKvRfIsWDBKWHaGKbPEGrKvEwC5tJAO',
  'CITIZEN'
),
(
  'John Doe',
  'john@example.com',
  '$2a$10$dXJ3ERSf/8/Z3h1K2m1l2OKvRfIsWDBKWHaGKbPEGrKvEwC5tJAO',
  'CITIZEN'
),
(
  'Jane Smith',
  'jane@example.com',
  '$2a$10$dXJ3ERSf/8/Z3h1K2m1l2OKvRfIsWDBKWHaGKbPEGrKvEwC5tJAO',
  'CITIZEN'
);

-- Insert Demo Complaints (Sample Data for Testing)
INSERT IGNORE INTO complaints 
(complaint_id, title, description, category, status, latitude, longitude, sdg_goal, user_id, resolved_at) 
VALUES 
(
  'CL-1701234567-abc12345',
  'Garbage overflow at Main Junction',
  'There is excessive garbage accumulation at the intersection of Main and Park Street. Needs immediate cleanup.',
  'WASTE',
  'RESOLVED',
  28.6139,
  77.2090,
  'SDG 11: Sustainable Cities & Communities',
  2,
  NOW() - INTERVAL 5 DAY
),
(
  'CL-1701234568-def67890',
  'Broken water pipe on Oak Avenue',
  'Water is leaking from underground pipe, causing wastage and a potential hazard.',
  'WATER',
  'IN_PROGRESS',
  28.6200,
  77.2150,
  'SDG 6: Clean Water & Sanitation',
  3,
  NULL
),
(
  'CL-1701234569-ghi34567',
  'Pothole near City Hospital',
  'Large pothole on the main road causing traffic disruption and vehicle damage.',
  'ROAD',
  'PENDING',
  28.6300,
  77.2250,
  'SDG 9: Industry, Innovation & Infrastructure',
  2,
  NULL
),
(
  'CL-1701234570-jkl78901',
  'Street lights not working in Block 5',
  'Multiple street lights are non-functional in the residential area, creating safety concerns.',
  'STREETLIGHT',
  'IN_PROGRESS',
  28.6100,
  77.2050,
  'SDG 7: Affordable & Clean Energy',
  4,
  NULL
),
(
  'CL-1701234571-mno56789',
  'Dangerous debris on sidewalk',
  'Fallen tree branch creating hazard for pedestrians near the park entrance.',
  'HAZARD',
  'RESOLVED',
  28.6400,
  77.2350,
  'SDG 3: Good Health & Well-being',
  3,
  NOW() - INTERVAL 2 DAY
),
(
  'CL-1701234572-pqr23456',
  'Improper waste disposal',
  'Construction waste illegally dumped in residential area.',
  'WASTE',
  'RESOLVED',
  28.6250,
  77.2200,
  'SDG 11: Sustainable Cities & Communities',
  2,
  NOW() - INTERVAL 10 DAY
),
(
  'CL-1701234573-stu90123',
  'Water quality issue - Brown water',
  'Tap water appears brown and discolored, indicating quality problems.',
  'WATER',
  'PENDING',
  28.6150,
  77.2100,
  'SDG 6: Clean Water & Sanitation',
  4,
  NULL
),
(
  'CL-1701234574-vwx67890',
  'Road surface cracking badly',
  'Significant deterioration and cracking on the access road making it unsafe.',
  'ROAD',
  'IN_PROGRESS',
  28.6180,
  77.2120,
  'SDG 9: Industry, Innovation & Infrastructure',
  3,
  NULL
);

-- Create indexes for optimal performance
CREATE INDEX idx_complaints_status_category ON complaints(status, category);
CREATE INDEX idx_complaints_sdg_goal ON complaints(sdg_goal);
CREATE INDEX idx_users_email ON users(email);

-- Display summary
SELECT 'Database initialization completed!' as status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Complaints' FROM complaints;
