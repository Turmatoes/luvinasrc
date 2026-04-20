// types/employee.ts

// Department DTO - matches backend DepartmentDTO
export interface DepartmentDTO {
  departmentId: number;
  departmentName: string;
}

// API Response DTO - matches backend EmployeeListDTO
export interface EmployeeListDTO {
  employeeId: number;
  employeeName: string;
  employeeBirthDate?: string; // DATE format (YYYY-MM-DD)
  departmentName: string;
  employeeEmail: string;
  employeeTelephone?: string;
  certificationName?: string;
  endDate?: string; // DATE format (YYYY-MM-DD)
  score?: number;
}

// API Response - matches backend EmployeeListResponse
export interface EmployeeListResponse {
  code: string;
  message?: string;
  totalRecords: number;
  employees: EmployeeListDTO[];
}

// Certification DTO
export interface CertificationDTO {
  certificationId: number;
  certificationName: string;
}

// Certification Request Item
export interface EmployeeCertificationRequest {
  certificationId: number;
  certificationStartDate: string;
  certificationEndDate: string;
  score: number;
}

// Backend/Database representation
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

// API request types (ADM004)
export interface EmployeeRequest {
  employeeId?: number; // Null for Add, Not null for Edit
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string;
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginId: string;
  employeeLoginPassword?: string;
  departmentId: number;
  certifications: EmployeeCertificationRequest[];
}

