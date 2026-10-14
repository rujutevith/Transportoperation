-- ==============================================================
-- TransportOperation / EliteRent: Full Database Migration Schema
-- ==============================================================

CREATE DATABASE IF NOT EXISTS car_management;
USE car_management;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  google_id VARCHAR(255) NULL,
  role ENUM('customer', 'dealer', 'admin') DEFAULT 'customer',
  phone VARCHAR(50),
  address TEXT,
  avatar_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status ENUM('none', 'pending', 'approved', 'rejected') DEFAULT 'none',
  dealer_company_name VARCHAR(255),
  dealer_description TEXT,
  dealer_logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CARS TABLE
CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- daily rental default or base price
  daily_rental_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  weekly_rental_rate DECIMAL(10, 2) DEFAULT 0.00,
  sale_price DECIMAL(12, 2) DEFAULT 0.00,
  listing_type ENUM('rent', 'sale', 'both') DEFAULT 'both',
  category ENUM('suv', 'sedan', 'luxury', 'electric', 'sports', 'pickup', 'coupe') DEFAULT 'luxury',
  color VARCHAR(50),
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  mileage INT DEFAULT 0,
  seats INT DEFAULT 5,
  engine_specs VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 4.9,
  reviews_count INT DEFAULT 18,
  image_url VARCHAR(500),
  description TEXT,
  features JSON,
  location VARCHAR(255) DEFAULT 'Bugesera, Nyamata, Rwanda',
  status ENUM('available', 'rented', 'reserved', 'sold', 'maintenance') DEFAULT 'available',
  owner_id INT DEFAULT 1,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. CAR IMAGES (For 360 / Multi-angle galleries)
CREATE TABLE IF NOT EXISTS car_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- 4. RENTALS TABLE
CREATE TABLE IF NOT EXISTS rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_time VARCHAR(20) DEFAULT '10:00 AM',
  dropoff_time VARCHAR(20) DEFAULT '10:00 AM',
  total_price DECIMAL(10, 2) NOT NULL,
  insurance_option VARCHAR(50) DEFAULT 'basic',
  insurance_cost DECIMAL(10, 2) DEFAULT 0.00,
  security_deposit DECIMAL(10, 2) DEFAULT 200.00,
  status ENUM('pending', 'approved', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'deposit_paid', 'paid', 'refunded') DEFAULT 'unpaid',
  pickup_location VARCHAR(255) DEFAULT 'Bugesera, Nyamata',
  dropoff_location VARCHAR(255) DEFAULT 'Bugesera, Nyamata',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- 5. SALES ORDERS TABLE
CREATE TABLE IF NOT EXISTS sales_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  sale_price DECIMAL(12, 2) NOT NULL,
  financing_selected BOOLEAN DEFAULT FALSE,
  down_payment DECIMAL(12, 2) DEFAULT 0.00,
  monthly_term_months INT DEFAULT 0,
  status ENUM('inquiry', 'negotiating', 'test_drive_scheduled', 'deposit_paid', 'sold', 'cancelled') DEFAULT 'inquiry',
  payment_status ENUM('unpaid', 'deposit_paid', 'paid_in_full', 'refunded') DEFAULT 'unpaid',
  notes TEXT,
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. TEST DRIVES TABLE
CREATE TABLE IF NOT EXISTS test_drives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  user_id INT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(20) NOT NULL,
  notes TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. DRIVER VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS driver_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  license_expiry DATE,
  license_front_url VARCHAR(500),
  license_back_url VARCHAR(500),
  id_document_url VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_car (user_id, car_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  car_id INT NULL,
  dealer_id INT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. MESSAGES & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  car_id INT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. SEED MASTER ADMIN USER
INSERT INTO users (id, name, email, password, role, is_verified) 
VALUES (1, 'Thierry (Master Admin)', 'isingizwetitanthierry@gmail.com', '$2a$10$rVeiREC.37t6TFl612vMIuEbtZFdIJzHEZKE5tulkcoeiMuBMa/3S', 'admin', TRUE)
ON DUPLICATE KEY UPDATE role='admin', password='$2a$10$rVeiREC.37t6TFl612vMIuEbtZFdIJzHEZKE5tulkcoeiMuBMa/3S';

