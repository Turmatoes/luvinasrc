'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEmployeeApi } from '@/hooks/useEmployeeApi';
import { useCallback, useEffect, useState } from 'react';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable, { SortDirection, SortKey } from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';

const LIMIT_PER_PAGE = 20;
const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'desc',
  endDate: 'asc',
};

export default function EmployeeListPage() {
  useAuth();
  const { fetchDepartments, fetchEmployees } = useEmployeeApi();
  
  // Data state
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  
  // Search filter state
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<Record<SortKey, SortDirection>>(DEFAULT_SORT);

  // Fetch departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
        setDepartments(response);
        setDepartmentError(null);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setDepartmentError('部門を取得できません');
      }
    };

    loadDepartments();
  }, [fetchDepartments]);

  // Fetch employees based on search filters and pagination
  const loadEmployees = useCallback(async (
    name: string,
    deptId: number | null,
    page: number,
    sortState: Record<SortKey, SortDirection>
  ) => {
    setLoading(true);
    setEmployeeError(null);
    try {
      const response = await fetchEmployees({
        employeeName: name,
        departmentId: deptId,
        page,
        limit: LIMIT_PER_PAGE,
        sort: sortState,
      });
      setData(response);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployeeError('従業員を取得できません');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees]);

  // Initial load
  useEffect(() => {
    loadEmployees('', null, 1, DEFAULT_SORT);
  }, [loadEmployees]);

  // Handle search
  const handleSearch = (name: string, deptId: number | null) => {
    setEmployeeName(name);
    setSelectedDepartmentId(deptId);
    setCurrentPage(1);
    loadEmployees(name, deptId, 1, sort);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadEmployees(employeeName, selectedDepartmentId, page, sort);
  };

  const handleSort = (key: SortKey) => {
    const nextSort: Record<SortKey, SortDirection> = {
      ...sort,
      [key]: sort[key] === 'asc' ? 'desc' : 'asc',
    };

    setSort(nextSort);
    setCurrentPage(1);
    loadEmployees(employeeName, selectedDepartmentId, 1, nextSort);
  };

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
  };

  const handleEmployeeNameChange = (name: string) => {
    setEmployeeName(name);
  };

  // Calculate pagination
  const totalPages = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;

  return (
    <>
      {departmentError && (
        <div className="alert alert-danger" role="alert">
          {departmentError}
        </div>
      )}
      
      {employeeError && (
        <div className="alert alert-danger" role="alert">
          {employeeError}
        </div>
      )}

      <SearchForm 
        departments={departments}
        selectedDepartmentId={selectedDepartmentId}
        employeeName={employeeName}
        onDepartmentChange={handleDepartmentChange}
        onEmployeeNameChange={handleEmployeeNameChange}
        onSearch={handleSearch}
      />

      {loading && <div className="text-center py-4">Đang tải...</div>}

      {!loading && data && data.employees.length === 0 && (
        <div className="alert alert-info" role="alert">
          検索条件に該当するユーザが見つかりません。
        </div>
      )}

      {!loading && data && data.employees.length > 0 && (
        <>
          <EmployeeTable data={data} sort={sort} onSort={handleSort} />
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}

