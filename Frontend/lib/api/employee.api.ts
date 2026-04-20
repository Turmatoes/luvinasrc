/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * employee.api.ts, April 13, 2026 nxplong
 */
import { apiClient } from './client';
import { DepartmentDTO, EmployeeListResponse, CertificationDTO, EmployeeFormValues } from '@/types/employee';
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
   * Lấy danh sách chứng chỉ (Mock API cho mục 資格 - 日本語能力).
   * 
   * @returns Promise chứa mảng CertificationDTO
   */
  getCertifications: async (): Promise<CertificationDTO[]> => {
    // Tạm thời mock dữ liệu Frontend trước khi có Backend API
    return [
      { certificationId: 1, certificationName: 'N1' },
      { certificationId: 2, certificationName: 'N2' },
      { certificationId: 3, certificationName: 'N3' },
      { certificationId: 4, certificationName: 'N4' },
      { certificationId: 5, certificationName: 'N5' },
    ];
    // Khi có Backend, sử dụng:
    // const response = await apiClient.get<CertificationDTO[]>('/certifications');
    // return response.data;
  },

  /**
   * Lấy chi tiết một nhân viên.
   */
  getEmployeeDetail: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Thêm mới nhân viên.
   */
  addEmployee: async (data: EmployeeFormValues): Promise<any> => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  /**
   * Cập nhật nhân viên.
   */
  updateEmployee: async (id: number, data: EmployeeFormValues): Promise<any> => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },
};
