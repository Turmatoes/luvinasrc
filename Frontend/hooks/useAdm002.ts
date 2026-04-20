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
import { LIMIT_PER_PAGE } from '@/lib/constants/config';


const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'desc',
  certificationEndDate: 'asc',
};

/**
 * Custom Hook useAdm002 quản lý toàn bộ trạng thái và logic nghiệp vụ cho Nhân viên.
 * Thực hiện theo mô hình: UI -> Hook -> API.
 * 
 * @returns Object chứa dữ liệu và các hàm thao tác
 */
export function useAdm002() {
  // Trạng thái dữ liệu
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);

  // Trạng thái bộ lọc và phân trang (State Orchestration)
  const [searchParams, setSearchParams] = useState({
    employeeName: '',
    departmentId: null as number | null,
    currentPage: 1,
    sort: DEFAULT_SORT,
  });

  /**
   * Tải danh sách phòng ban khi hook khởi tạo.
   */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await employeeApi.getDepartments();
        setDepartments(response);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
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
      setData(response);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      // Ưu tiên lấy mã lỗi từ Backend trả về
      const errorCode = err.response?.data?.code || 'ER023';
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
    setSearchParams(prev => ({
      ...prev,
      employeeName: name,
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
    setSearchParams(prev => ({ ...prev, departmentId: deptId }));
  };

  /**
   * Xử lý thay đổi tên nhân viên.
   */
  const handleEmployeeNameChange = (name: string) => {
    setSearchParams(prev => ({ ...prev, employeeName: name }));
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
