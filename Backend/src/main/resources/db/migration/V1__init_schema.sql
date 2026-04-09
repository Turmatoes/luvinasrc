-- =============================================================
-- V1 - Initialize database schema + Clear old data + Insert sample data
-- =============================================================

-- Clear old data first (for fresh initialization)
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM employees_certifications;
DELETE FROM employees;
DELETE FROM certifications;
DELETE FROM departments;

SET FOREIGN_KEY_CHECKS = 1;

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
    role TINYINT DEFAULT 0 COMMENT '1: Admin, 0: Employee',
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
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (employee_certification_id),
    CONSTRAINT FK_emp_cert_employee FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id),
    CONSTRAINT FK_emp_cert_certification FOREIGN KEY (certification_id)
        REFERENCES certifications(certification_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- NOTE: Sample data (admin + employees + certifications) is populated 
-- by DataLoader.java on application startup (via CommandLineRunner)
-- =====================================================================
