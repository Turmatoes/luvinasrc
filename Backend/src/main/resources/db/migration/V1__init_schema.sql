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
-- Insert sample data
-- =====================================================================

-- 1. Insert departments
INSERT INTO departments (department_id, department_name) VALUES (1, 'Phòng IT');
INSERT INTO departments (department_id, department_name) VALUES (2, 'Phòng QAT');
INSERT INTO departments (department_id, department_name) VALUES (3, '管理部');

-- 2. Insert certifications
INSERT INTO certifications (certification_id, certification_name, certification_level) VALUES (1, 'Trình độ tiếng nhật cấp 1', 1);
INSERT INTO certifications (certification_id, certification_name, certification_level) VALUES (2, 'Trình độ tiếng nhật cấp 2', 2);
INSERT INTO certifications (certification_id, certification_name, certification_level) VALUES (3, 'Trình độ tiếng nhật cấp 3', 3);
INSERT INTO certifications (certification_id, certification_name, certification_level) VALUES (4, 'Trình độ tiếng nhật cấp 4', 4);
INSERT INTO certifications (certification_id, certification_name, certification_level) VALUES (5, 'Trình độ tiếng nhật cấp 5', 5);

-- 3. Insert admin user (role=1) - will not appear in employee list
-- Password: admin (BCrypt encoded: $2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy)
INSERT INTO employees (employee_id, department_id, employee_name, employee_name_kana, employee_email, employee_login_id, employee_login_password, role) 
VALUES (1, 1, 'Administrator', 'アドミニストレーター', 'admin@luvina.net', 'admin', '$2a$10$r.XIN4K9vTioiuYQwaTop.UVQ5r5FvrKk2V5Orm9Hc6n4i9Tvjthy', 1);

-- 4. Insert regular employees (role=0) - will appear in employee list
INSERT INTO employees (employee_id, department_id, employee_name, employee_email, employee_telephone, employee_login_id, employee_login_password, employee_birth_date, role) 
VALUES (2, 2, 'Nguyễn Thị Mai Hương', 'ntmhuong@luvina.net', '0914326386', 'ntmhuong', 'admin', '1983-07-08', 0);

INSERT INTO employees (employee_id, department_id, employee_name, employee_email, employee_telephone, employee_login_id, employee_login_password, employee_birth_date, role) 
VALUES (3, 1, 'Lê Thị Xoa', 'xoalt@luvina.net', '1234567894', 'xoalt', 'admin', '1983-07-08', 0);

INSERT INTO employees (employee_id, department_id, employee_name, employee_email, employee_telephone, employee_login_id, employee_login_password, employee_birth_date, role) 
VALUES (4, 2, 'Đặng Thị Hân', 'handt@luvina.net', '0914326387', 'handt', 'admin', '1985-05-15', 0);

-- 5. Insert employee certifications
INSERT INTO employees_certifications (employee_id, certification_id, start_date, end_date, score) 
VALUES (2, 4, '2023-01-15', '2025-01-14', 290);

INSERT INTO employees_certifications (employee_id, certification_id, start_date, end_date, score) 
VALUES (3, 4, '2023-03-20', '2025-03-19', 280);

INSERT INTO employees_certifications (employee_id, certification_id, start_date, end_date, score) 
VALUES (4, 3, '2023-06-10', '2025-06-09', 310);
