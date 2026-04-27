/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.ts, April 20, 2026 longnxp
 */

// Department DTO 
export interface DepartmentDTO {
  departmentId: number;
  departmentName: string;
}

// Certification DTO 
export interface CertificationDTO {
  certificationId: number;
  certificationName: string;
}

// API Response DTO 
export interface EmployeeListDTO {
  employeeId: number;
  employeeName: string;
  employeeBirthDate?: string; // DATE format (YYYY-MM-DD)
  departmentName: string;
  employeeEmail: string;
  employeeTelephone?: string;
  certificationName?: string;
  certificationStartDate?: string; // DATE format (YYYY-MM-DD)
  certificationEndDate?: string; // DATE format (YYYY-MM-DD)
  score?: number;
}

// API Phản hồi
export interface EmployeeListResponse {
  code: string;
  message?: string;
  totalRecords: number;
  employees: EmployeeListDTO[];
}

// Backend/Database 
export interface EmployeeDB {
  employee_id: number;
  department_id: number;
  employee_name: string;
  employee_name_kana?: string;
  employee_birth_date?: string;
  employee_email: string;
  employee_telephone?: string;
  employee_login_id: string;
  employee_login_password?: string;
  role?: number; // 1: Admin, 0: Employee
}

// Loại API request/response
export interface EmployeeCreateRequest {
  employee_name: string;
  department_id: number;
  employee_email: string;
  employee_name_kana?: string;
  employee_birth_date?: string;
  employee_telephone?: string;
  employee_login_id: string;
}

export interface EmployeeUpdateRequest {
  employee_id: number;
  employee_name: string;
  department_id: number;
  employee_email: string;
  employee_name_kana?: string;
  employee_birth_date?: string;
  employee_telephone?: string;
  employee_login_id: string;
}

// Unified Form Schema
export interface EmployeeFormValues {
  employeeId?: number;
  employeeLoginId: string;
  departmentId: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string; // YYYY/MM/DD
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginPassword?: string;
  employeeLoginPasswordConfirm?: string;
  certificationId?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  score?: string;
}

