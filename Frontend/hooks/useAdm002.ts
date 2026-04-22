/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm002.ts, April 22, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import { SortDirection, SortKey } from '@/components/employees/EmployeeTable';
import { getMessage } from '@/lib/utils/messageHelper';
import { LIMIT_PER_PAGE, MAX_FULLNAME_LENGTH } from '@/lib/constants/config';

const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'asc',
  certificationEndDate: 'asc',
};

interface SearchFormState {
  employeeName: string;
  departmentId: number | null;
}

export function useAdm002() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- 1. Đọc trạng thái từ URL ---
  const urlParams = useMemo(() => {
    return {
      employeeName: searchParams.get('name') || '',
      departmentId: searchParams.get('dept') ? parseInt(searchParams.get('dept')!) : null,
      currentPage: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      sort: {
        employeeName: (searchParams.get('sortName') as SortDirection) || DEFAULT_SORT.employeeName,
        certificationName: (searchParams.get('sortCert') as SortDirection) || DEFAULT_SORT.certificationName,
        certificationEndDate: (searchParams.get('sortDate') as SortDirection) || DEFAULT_SORT.certificationEndDate,
      } as Record<SortKey, SortDirection>,
    };
  }, [searchParams]);

  // --- 2. Trạng thái Local cho Form (chưa submit) ---
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    employeeName: urlParams.employeeName,
    departmentId: urlParams.departmentId,
  });

  // Đồng bộ searchForm khi URL thay đổi (trường hợp nhấn Back/Forward trình duyệt)
  useEffect(() => {
    setSearchForm({
      employeeName: urlParams.employeeName,
      departmentId: urlParams.departmentId,
    });
  }, [urlParams.employeeName, urlParams.departmentId]);

  // --- 3. Trạng thái dữ liệu ---
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [employeeNameError, setEmployeeNameError] = useState<string | null>(null);

  /**
   * Tải danh sách phòng ban khi hook khởi tạo.
   */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await employeeApi.getDepartments();
        setDepartments(response);
      } catch (err) {
        console.error('Lỗi khi tải danh sách phòng ban:', err);
        setDepartmentError(getMessage('ER023'));
      }
    };
    loadDepartments();
  }, []);

  /**
   * Hàm helper để cập nhật URL dựa trên các tham số mới.
   */
  const updateUrl = useCallback((params: {
    name?: string;
    dept?: number | null;
    page?: number;
    sort?: Record<SortKey, SortDirection>;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.name !== undefined) {
      if (params.name) newParams.set('name', params.name);
      else newParams.delete('name');
    }
    
    if (params.dept !== undefined) {
      if (params.dept) newParams.set('dept', params.dept.toString());
      else newParams.delete('dept');
    }

    if (params.page !== undefined) {
      newParams.set('page', params.page.toString());
    }

    if (params.sort !== undefined) {
      newParams.set('sortName', params.sort.employeeName);
      newParams.set('sortCert', params.sort.certificationName);
      newParams.set('sortDate', params.sort.certificationEndDate);
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  }, [pathname, router, searchParams]);

  /**
   * Logic chính để tải danh sách nhân viên từ API Service.
   */
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setEmployeeError(null);
    try {
      const response = await employeeApi.getEmployees({
        employeeName: urlParams.employeeName.trim() || null,
        departmentId: urlParams.departmentId,
        offset: (urlParams.currentPage - 1) * LIMIT_PER_PAGE,
        limit: LIMIT_PER_PAGE,
        sortEmployeeName: urlParams.sort.employeeName,
        sortCertificationName: urlParams.sort.certificationName,
        sortEndDate: urlParams.sort.certificationEndDate,
      });
      
      const employees = response.employees ?? [];
      const totalPages = response.totalRecords > 0 ? Math.ceil(response.totalRecords / LIMIT_PER_PAGE) : 0;

      // Nếu trang hiện tại vượt quá tổng số trang (do xóa dữ liệu), quay về trang cuối
      if (response.totalRecords > 0 && employees.length === 0 && urlParams.currentPage > totalPages) {
        updateUrl({ page: totalPages });
        return;
      }

      setData({
        ...response,
        employees,
      });
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách nhân viên:', err);
      const errorCode = (err as any)?.response?.data?.code ?? 'ER023';
      setEmployeeError(getMessage(errorCode));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [urlParams, updateUrl]);

  /**
   * Tự động gọi lại API khi URL parameters thay đổi.
   */
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // --- Các hàm xử lý sự kiện (Actions) ---

  /**
   * Xử lý tìm kiếm nhân viên.
   */
  const handleSearch = (name: string, deptId: number | null) => {
    const normalizedName = name.trim();

    if (normalizedName.length > MAX_FULLNAME_LENGTH) {
      setEmployeeNameError(getMessage('ER006', ['氏名', MAX_FULLNAME_LENGTH]));
      return;
    }

    setEmployeeNameError(null);
    updateUrl({
      name: normalizedName,
      dept: deptId,
      page: 1, // Reset về trang 1 khi tìm kiếm mới
    });
  };

  /**
   * Xử lý thay đổi trang.
   */
  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  /**
   * Xử lý sắp xếp.
   */
  const handleSort = (key: SortKey) => {
    const newSort = {
      ...urlParams.sort,
      [key]: urlParams.sort[key] === 'asc' ? 'desc' : 'asc',
    };
    updateUrl({
      page: 1,
      sort: newSort,
    });
  };

  /**
   * Xử lý thay đổi phòng ban.
   */
  const handleDepartmentChange = (deptId: number | null) => {
    setSearchForm(prev => ({ ...prev, departmentId: deptId }));
  };

  /**
   * Xử lý thay đổi tên nhân viên.
   */
  const handleEmployeeNameChange = (name: string) => {
    setSearchForm(prev => ({ ...prev, employeeName: name }));
    if (name.trim().length <= MAX_FULLNAME_LENGTH) {
      setEmployeeNameError(null);
    }
  };

  /**
   * Tính toán danh sách số trang hiển thị.
   */
  const pageNumbers = useMemo(() => {
    const total = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;
    const current = urlParams.currentPage;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total <= 1) return [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }
    return pages;
  }, [data, urlParams.currentPage]);

  return {
    data,
    departments,
    loading,
    departmentError,
    employeeError,
    employeeNameError,
    searchForm,
    filters: urlParams,
    totalPages: data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0,
    pageNumbers,
    handleSearch,
    handlePageChange,
    handleSort,
    handleDepartmentChange,
    handleEmployeeNameChange,
  };
}
