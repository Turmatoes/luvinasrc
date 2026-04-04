-- 1. Tạo bảng Bảng thông tin phòng ban (departments)
CREATE TABLE departments (
    department_id BIGINT AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (department_id)
);

-- 2. Tạo bảng Bảng thông tin nhân viên (employees)
CREATE TABLE employees (
    employee_id BIGINT AUTO_INCREMENT,
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
);

-- 3. Tạo bảng Bảng thông tin chứng chỉ tiếng Nhật (certifications)
CREATE TABLE certifications (
    certification_id BIGINT AUTO_INCREMENT,
    certification_name VARCHAR(50) NOT NULL,
    certification_level INT NOT NULL, -- Ghi chú: Giá trị càng nhỏ trình độ càng cao
    PRIMARY KEY (certification_id)
);

-- 4. Tạo bảng Quan hệ nhân viên chứng chỉ (employees_certifications)
CREATE TABLE employees_certifications (
    employee_certification_id BIGINT AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    certification_id BIGINT NOT NULL,
    PRIMARY KEY (employee_certification_id),
    CONSTRAINT FK_emp_cert_employee FOREIGN KEY (employee_id) 
        REFERENCES employees(employee_id),
    CONSTRAINT FK_emp_cert_certification FOREIGN KEY (certification_id) 
        REFERENCES certifications(certification_id)
);