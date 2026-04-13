import { apiClient } from './client';
import { DepartmentDTO, EmployeeListResponse } from '@/types/employee';
import { SortDirection } from '@/components/employees/EmployeeTable';

/**
 * Tham số truy vấn cho API danh sách nhân viên.
 */
export interface EmployeeListQueryParams {
  employeeName?: string | null;
  departmentId?: number | null;
  limit: number;
  offset: number;
  sortEmployeeName: SortDirection;
  sortCertificationName: SortDirection;
  sortEndDate: SortDirection;
}

/**
 * Lớp API Service xử lý các yêu cầu liên quan đến Nhân viên.
 * Tương tác trực tiếp với Axios client.
 */
export const employeeApi = {
  /**
   * Lấy danh sách nhân viên từ Backend.
   * 
   * @param params Bộ lọc và tham số phân trang, sắp xếp
   * @returns Promise chứa EmployeeListResponse
   */
  getEmployees: async (params: EmployeeListQueryParams): Promise<EmployeeListResponse> => {
    const response = await apiClient.get<EmployeeListResponse>('/employees', { params });
    return response.data;
  },

  /**
   * Lấy danh sách phòng ban.
   * 
   * @returns Promise chứa mảng DepartmentDTO
   */
  getDepartments: async (): Promise<DepartmentDTO[]> => {
    const response = await apiClient.get<DepartmentDTO[]>('/departments');
    return response.data;
  },
};
