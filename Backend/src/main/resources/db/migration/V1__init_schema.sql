-- =============================================================
-- V1 - Initialize database schema
-- =============================================================

-- 1. Tạo bảng thông tin phòng ban (departments)
CREATE TABLE IF NOT EXISTS `departments` (
    department_id BIGINT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tạo bảng thông tin nhân viên (employees)
CREATE TABLE IF NOT EXISTS `employees` (
    employee_id BIGINT NOT NULL AUTO_INCREMENT,
    department_id BIGINT NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    employee_name_kana VARCHAR(255),
    employee_birth_date DATE,
    employee_email VARCHAR(255) NOT NULL,
    employee_telephone VARCHAR(50),
    employee_login_id VARCHAR(50) NOT NULL,
    employee_login_password VARCHAR(100),
    PRIMARY KEY (employee_id),
    CONSTRAINT FK_employees_departments FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tạo bảng thông tin chứng chỉ tiếng Nhật (certifications)
CREATE TABLE IF NOT EXISTS `certifications` (
    certification_id BIGINT NOT NULL AUTO_INCREMENT,
    certification_name VARCHAR(50) NOT NULL,
    certification_level INT NOT NULL, -- Giá trị càng nhỏ trình độ càng cao
    PRIMARY KEY (certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tạo bảng quan hệ nhân viên - chứng chỉ (employees_certifications)
CREATE TABLE IF NOT EXISTS `employees_certifications` (
    employee_certification_id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    certification_id BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    score DECIMAL(5, 2),
    PRIMARY KEY (employee_certification_id),
    CONSTRAINT FK_emp_cert_employee FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),
    CONSTRAINT FK_emp_cert_certification FOREIGN KEY (certification_id)
        REFERENCES certifications(certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================
-- Seed data
-- =============================================================

-- Phòng ban mặc định
INSERT INTO departments (department_name) VALUES ('管理部');

-- Nhân viên admin
-- Password: admin (BCrypt encoded)
INSERT INTO employees (department_id, employee_name, employee_name_kana, employee_email, employee_login_id, employee_login_password)
VALUES (1, 'Administrator', 'アドミニストレーター', 'la@luvina.net', 'admin', '$2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy');

-- Chứng chỉ mẫu
INSERT INTO certifications (certification_name, certification_level) VALUES ('N1', 1);
INSERT INTO certifications (certification_name, certification_level) VALUES ('N2', 2);
INSERT INTO certifications (certification_name, certification_level) VALUES ('N3', 3);
INSERT INTO certifications (certification_name, certification_level) VALUES ('N4', 4);
INSERT INTO certifications (certification_name, certification_level) VALUES ('N5', 5);