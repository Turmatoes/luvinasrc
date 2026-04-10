'use client';

import { useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { DepartmentDTO, EmployeeListResponse } from '@/types/employee';
import { SortDirection, SortKey } from '@/components/employees/EmployeeTable';

export interface EmployeeListQueryParams {
  employeeName: string;
  departmentId: number | null;
  page: number;
  limit: number;
  sort: Record<SortKey, SortDirection>;
}

export function useEmployeeApi() {
  const fetchDepartments = useCallback(async (): Promise<DepartmentDTO[]> => {
    const response = await apiClient.get<DepartmentDTO[]>('/departments');
    return response.data;
  }, []);

  const fetchEmployees = useCallback(async ({
    employeeName,
    departmentId,
    page,
    limit,
    sort,
  }: EmployeeListQueryParams): Promise<EmployeeListResponse> => {
    const params = {
      limit,
      offset: (page - 1) * limit,
      employeeName: employeeName.trim() || null,
      departmentId,
      sortEmployeeName: sort.employeeName,
      sortCertificationName: sort.certificationName,
      sortEndDate: sort.endDate,
    };

    const response = await apiClient.get<EmployeeListResponse>('/employees', { params });
    return response.data;
  }, []);

  return {
    fetchDepartments,
    fetchEmployees,
  };
}
