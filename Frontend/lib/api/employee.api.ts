/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.api.ts, April 13, 2026 nxplong
 */
import { apiClient } from './client';
import { DepartmentDTO, EmployeeListResponse, CertificationDTO, EmployeeRequest } from '@/types/employee';
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

  /**
   * Lấy danh sách chứng chỉ.
   * 
   * @returns Promise chứa mảng CertificationDTO
   */
  getCertifications: async (): Promise<CertificationDTO[]> => {
    const response = await apiClient.get<CertificationDTO[]>('/certifications');
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết nhân viên theo ID.
   * 
   * @param id ID nhân viên
   * @returns Promise chứa EmployeeRequest (đầy đủ thông tin để edit)
   */
  getEmployee: async (id: number): Promise<EmployeeRequest> => {
    const response = await apiClient.get<EmployeeRequest>(`/employees/${id}`);
    return response.data;
  },

  /**
   * Thêm mới nhân viên.
   * 
   * @param data Dữ liệu nhân viên mới
   * @returns Promise chứa phản hồi từ server
   */
  createEmployee: async (data: EmployeeRequest): Promise<unknown> => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  /**
   * Cập nhật thông tin nhân viên.
   * 
   * @param data Dữ liệu nhân viên (bao gồm cả employeeId)
   * @returns Promise chứa phản hồi từ server
   */
  updateEmployee: async (data: EmployeeRequest): Promise<unknown> => {
    const response = await apiClient.put(`/employees/${data.employeeId}`, data);
    return response.data;
  },
};
