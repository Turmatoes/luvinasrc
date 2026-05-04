/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.ts, April 20, 2026 longnxp
 */
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

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

// Props for Components
export interface EmployeeConfirmFormProps {
  formData: EmployeeFormValues;
  departments: Record<string, string>;
  certifications: Record<string, string>;
}

export interface EmployeeDetailFormProps {
  employee: any;
  handleEdit: () => void;
  handleDelete: () => void;
  handleBack: () => void;
}

export interface EmployeeInputFormProps {
  register: UseFormRegister<EmployeeFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<EmployeeFormValues>;
  setValue: UseFormSetValue<EmployeeFormValues>;
  watch: UseFormWatch<EmployeeFormValues>;
  departments: DepartmentDTO[];
  certifications: CertificationDTO[];
  isEditMode: boolean;
  handleBack: () => void;
  handleCertificationChange: (value: string) => void;
}

export type SortDirection = 'asc' | 'desc';
export type SortKey = 'employeeName' | 'certificationName' | 'certificationEndDate';

export interface EmployeeTableProps {
  data: EmployeeListResponse;
  sort: Record<SortKey, SortDirection>;
  onSort: (key: SortKey) => void;
  currentQueryString?: string;
}

export interface SearchFormProps {
  departments: DepartmentDTO[];
  selectedDepartmentId: number | null;
  employeeName: string;
  employeeNameError: string | null;
  onDepartmentChange: (departmentId: number | null) => void;
  onEmployeeNameChange: (name: string) => void;
  onSearch: (name: string, departmentId: number | null) => void;
  currentQueryString?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumbers: (number | string)[];
  onPageChange: (page: number) => void;
}

