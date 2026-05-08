/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.ts, April 20, 2026 nxplong
 */
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

/**
 * DTO cho danh mục phòng ban.
 * Dùng để hiển thị danh sách trong thẻ <select> tại màn hình ADM002 và ADM004.
 */
export interface DepartmentDTO {
  departmentId: number;
  departmentName: string;
}

/**
 * DTO cho danh mục chứng chỉ.
 * Dùng để hiển thị danh sách trong thẻ <select> tại màn hình ADM004.
 */
export interface CertificationDTO {
  certificationId: number;
  certificationName: string;
}

/**
 * DTO đại diện cho một nhân viên trong danh sách kết quả tìm kiếm.
 * Phục vụ cho việc hiển thị bảng dữ liệu tại màn hình ADM002.
 */
export interface EmployeeListDTO {
  employeeId: number;
  employeeName: string;
  employeeBirthDate?: string; // Định dạng YYYY-MM-DD
  departmentName: string;
  employeeEmail: string;
  employeeTelephone?: string;
  certificationName?: string;
  certificationStartDate?: string; // Định dạng YYYY-MM-DD
  certificationEndDate?: string; // Định dạng YYYY-MM-DD
  score?: number;
}

/**
 * Cấu trúc dữ liệu phản hồi từ API lấy danh sách nhân viên.
 * Dùng để render toàn bộ màn hình ADM002 (bao gồm cả phân trang).
 */
export interface EmployeeListResponse {
  code: string;
  message?: string;
  totalRecords: number;
  employees: EmployeeListDTO[];
}

/**
 * Interface đại diện cho cấu trúc bảng Employee trong Database.
 * Thường dùng trong các hàm xử lý dữ liệu thô hoặc ánh xạ (mapping).
 */
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

/**
 * Dữ liệu yêu cầu khi tạo mới nhân viên.
 * Gửi từ ADM005 (xác nhận) lên API Backend.
 */
export interface EmployeeCreateRequest {
  employee_name: string;
  department_id: number;
  employee_email: string;
  employee_name_kana?: string;
  employee_birth_date?: string;
  employee_telephone?: string;
  employee_login_id: string;
}

/**
 * Dữ liệu yêu cầu khi cập nhật nhân viên.
 * Gửi từ ADM005 (xác nhận chỉnh sửa) lên API Backend.
 */
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

/**
 * Kiểu dữ liệu đồng nhất cho toàn bộ Form nhập liệu.
 * Phục vụ cho việc quản lý state form và validation tại ADM004.
 */
export interface EmployeeFormValues {
  employeeId?: number;
  employeeLoginId: string;
  departmentId: string;
  employeeName: string;
  employeeNameKana: string;
  employeeBirthDate: string; // Định dạng hiển thị YYYY/MM/DD
  employeeEmail: string;
  employeeTelephone: string;
  employeeLoginPassword?: string;
  employeeLoginPasswordConfirm?: string;
  certificationId?: string;
  certificationStartDate?: string;
  certificationEndDate?: string;
  score?: string;
}

/**
 * Props cho màn hình xác nhận thông tin.
 * Dùng tại ADM005 để hiển thị dữ liệu người dùng vừa nhập ở chế độ chỉ đọc.
 */
export interface EmployeeConfirmFormProps {
  formData: EmployeeFormValues;
  departments: Record<string, string>;
  certifications: Record<string, string>;
}

/**
 * Props cho màn hình hiển thị chi tiết nhân viên.
 * Dùng tại ADM003.
 */
export interface EmployeeDetailFormProps {
  employee: any;
  handleEdit: () => void;
  handleDelete: () => void;
  handleBack: () => void;
}

/**
 * Props cho component Form nhập liệu.
 * Dùng tại ADM004 để liên kết với custom hook useAdm004.
 */
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

/**
 * Định nghĩa hướng sắp xếp và khóa sắp xếp.
 * Dùng cho logic Sort tại bảng của màn hình ADM002.
 */
export type SortDirection = 'asc' | 'desc';
export type SortKey = 'employeeName' | 'certificationName' | 'certificationEndDate';

/**
 * Props cho component Bảng danh sách nhân viên.
 * Quản lý việc hiển thị dữ liệu và các hành động sắp xếp tại ADM002.
 */
export interface EmployeeTableProps {
  data: EmployeeListResponse;
  sort: Record<SortKey, SortDirection>;
  onSort: (key: SortKey) => void;
  currentQueryString?: string;
}

/**
 * Props cho component Form tìm kiếm.
 * Quản lý các ô nhập liệu và hành động tìm kiếm tại ADM002.
 */
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

/**
 * Props cho component Phân trang.
 * Dùng để điều khiển việc chuyển trang tại màn hình ADM002.
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumbers: (number | string)[];
  onPageChange: (page: number) => void;
}
