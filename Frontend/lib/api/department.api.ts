/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * department.api.ts, April 24, 2026 nxplong
 */
import { apiClient } from './client';
import { DepartmentDTO } from '@/types/employee';

/**
 * Lớp API Service xử lý các yêu cầu liên quan đến Phòng ban.
 */
export const departmentApi = {
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
