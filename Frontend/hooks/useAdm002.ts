/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm002.ts, April 13, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { employeeApi } from '@/lib/api/employee.api';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import { SortDirection, SortKey } from '@/components/employees/EmployeeTable';
import { getMessage } from '@/lib/utils/messageHelper';
import { LIMIT_PER_PAGE, MAX_FULLNAME_LENGTH } from '@/lib/constants/config';
import { getStorageKey, getSessionData, putSessionData } from '@/lib/utils/sessionStorage';

const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'asc',
  certificationEndDate: 'asc',
};

const LIST_STATE_KEY = getStorageKey('ADM002');

interface SearchFormState {
  employeeName: string;
  departmentId: number | null;
}

interface SearchParamsState {
  employeeName: string;
  departmentId: number | null;
  currentPage: number;
  sort: Record<SortKey, SortDirection>;
}
export function useAdm002() {
  // Trạng thái dữ liệu
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [employeeNameError, setEmployeeNameError] = useState<string | null>(null);
  const [searchForm, setSearchForm] = useState<SearchFormState>(() => {
    const saved = getSessionData(LIST_STATE_KEY);
    return saved?.searchForm || {
      employeeName: '',
      departmentId: null,
    };
  });

  // Trạng thái bộ lọc và phân trang (State Orchestration)
  const [searchParams, setSearchParams] = useState<SearchParamsState>(() => {
    const saved = getSessionData(LIST_STATE_KEY);
    return saved?.searchParams || {
      employeeName: '',
      departmentId: null,
      currentPage: 1,
      sort: DEFAULT_SORT,
    };
  });

  // Đồng bộ trạng thái vào sessionStorage khi có thay đổi (Auto-sync)
  useEffect(() => {
    putSessionData(LIST_STATE_KEY, { searchForm, searchParams });
  }, [searchForm, searchParams]);

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
   * Logic chính để tải danh sách nhân viên từ API Service.
   */
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setEmployeeError(null);
    try {
      const response = await employeeApi.getEmployees({
        employeeName: searchParams.employeeName.trim() || null,
        departmentId: searchParams.departmentId,
        offset: (searchParams.currentPage - 1) * LIMIT_PER_PAGE,
        limit: LIMIT_PER_PAGE,
        sortEmployeeName: searchParams.sort.employeeName,
        sortCertificationName: searchParams.sort.certificationName,
        sortEndDate: searchParams.sort.certificationEndDate,
      });
      const employees = response.employees ?? [];
      const totalPages =
        response.totalRecords > 0
          ? Math.ceil(response.totalRecords / LIMIT_PER_PAGE)
          : 0;

      if (
        response.totalRecords > 0 &&
        employees.length === 0 &&
        searchParams.currentPage > totalPages
      ) {
        setSearchParams(prev => ({
          ...prev,
          currentPage: totalPages,
        }));
        return;
      }

      setData({
        ...response,
        employees,
      });
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách nhân viên:', err);
      // Ưu tiên lấy mã lỗi từ Backend trả về
      const errorCode =
        typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { data?: { code?: string } } }).response?.data?.code === 'string'
          ? (err as { response?: { data?: { code?: string } } }).response?.data?.code ?? 'ER023'
          : 'ER023';
      setEmployeeError(getMessage(errorCode));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  /**
   * Tự động gọi lại API khi bất kỳ tham số tìm kiếm, phân trang hay sắp xếp nào thay đổi.
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
      setEmployeeNameError(
        getMessage('ER006', ['氏名', MAX_FULLNAME_LENGTH])
      );
      return;
    }

    setEmployeeNameError(null);
    setSearchParams(prev => ({
      ...prev,
      employeeName: normalizedName,
      departmentId: deptId,
      currentPage: 1, // Reset về trang 1 khi tìm kiếm mới
    }));
  };

  /**
   * Xử lý thay đổi trang.
   */
  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, currentPage: page }));
  };

  /**
   * Xử lý sắp xếp.
   */
  const handleSort = (key: SortKey) => {
    setSearchParams(prev => ({
      ...prev,
      currentPage: 1,
      sort: {
        ...prev.sort,
        [key]: prev.sort[key] === 'asc' ? 'desc' : 'asc',
      },
    }));
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
   * Tính toán danh sách số trang hiển thị (bao gồm cả dấu ba chấm).
   * Logic được chuyển từ Component Pagination.tsx chuyên biệt về đây.
   */
  const pageNumbers = (() => {
    const total = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;
    const current = searchParams.currentPage;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total <= 1) return [];

    if (total <= maxVisible) {
      // Hiển thị tất cả nếu tổng số trang <= 5
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu tiên
      pages.push(1);

      // Tính toán phạm vi xung quanh trang hiện tại
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      // Thêm dấu ba chấm phía trước nếu cần
      if (start > 2) {
        pages.push('...');
      }

      // Thêm các trang trong phạm vi
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Thêm dấu ba chấm phía sau nếu cần
      if (end < total - 1) {
        pages.push('...');
      }

      // Luôn hiển thị trang cuối cùng
      pages.push(total);
    }
    return pages;
  })();

  return {
    // Dữ liệu và trạng thái
    data,
    departments,
    loading,
    departmentError,
    employeeError,
    employeeNameError,
    searchForm,
    // Trạng thái hiện tại của bộ lọc
    filters: searchParams,
    totalPages: data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0,
    pageNumbers,
    // Các handlers cho UI
    handleSearch,
    handlePageChange,
    handleSort,
    handleDepartmentChange,
    handleEmployeeNameChange,
  };
}
