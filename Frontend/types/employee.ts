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
  code: number;
  totalRecords: number;
  employees: EmployeeListDTO[];
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

// API request/response types
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
  employee_id: number; // Required for PUT /employee (ID in request body, not path)
  employee_name: string; // Required
  department_id: number; // Required
  employee_email: string; // Required
  employee_name_kana?: string;
  employee_birth_date?: string;
  employee_telephone?: string;
  employee_login_id: string; // Required
}

export interface EmployeeListResponse {
  employees: Employee[]; // Frontend display format
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeSearchParams {
  name?: string; // Searches employee_name
  group?: string; // Filters by department_id (via department lookup)
  page?: number;
  limit?: number;
}

// types/department.ts
export interface Department {
  department_id: number;
  department_name: string;
}

// types/certification.ts
export interface Certification {
  certification_id: number;
  certification_name: string;
  certification_level: number;
}

export interface EmployeeCertification {
  employee_certification_id: number;
  employee_id: number;
  certification_id: number;
  start_date: string; // DATE format
  end_date: string; // DATE format
  score: number; // DECIMAL
}

