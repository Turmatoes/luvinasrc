/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.api.ts, April 13, 2026 nxplong
 */
import { apiClient } from './client';
import { EmployeeListResponse, EmployeeFormValues } from '@/types/employee';
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
   * Lấy chi tiết một nhân viên.
   */
  getEmployeeDetail: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Validate dữ liệu nhân viên.
   */
  validateEmployee: async (data: EmployeeFormValues): Promise<any> => {
    const { employeeLoginPasswordConfirm, ...rest } = data;
    const response = await apiClient.post('/employees/validate', rest);
    return response.data;
  },

  /**
   * Thêm mới nhân viên.
   */
  addEmployee: async (data: EmployeeFormValues): Promise<any> => {
    const { employeeLoginPasswordConfirm, ...rest } = data;
    const response = await apiClient.post('/employees', rest);
    return response.data;
  },

  /**
   * Cập nhật nhân viên sẽ được triển khai sau 
   */
  // updateEmployee: async (id: number, data: EmployeeFormValues): Promise<any> => {
  //   const { employeeLoginPasswordConfirm, ...rest } = data;
  //   const response = await apiClient.put(`/employees/${id}`, rest);
  //   return response.data;
  // },
};
