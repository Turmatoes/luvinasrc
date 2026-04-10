'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable, { SortDirection, SortKey } from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';

const LIMIT_PER_PAGE = 20;
const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'asc',
  endDate: 'asc',
};
const DEFAULT_SORT_BY: SortKey = 'employeeName';

export default function EmployeeListPage() {
  useAuth();
  
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
  const [sortBy, setSortBy] = useState<SortKey>(DEFAULT_SORT_BY);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<DepartmentDTO[]>('/departments');
        setDepartments(response.data);
        setDepartmentError(null);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setDepartmentError('部門を取得できません');
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees based on search filters and pagination
  const fetchEmployees = async (
    name: string,
    deptId: number | null,
    page: number,
    sortState: Record<SortKey, SortDirection>,
    sortByKey: SortKey
  ) => {
    setLoading(true);
    setEmployeeError(null);
    try {
      const params: {
        limit: number;
        offset: number;
        employeeName: string | null;
        departmentId: number | null;
        sortBy: SortKey;
        sortEmployeeName: SortDirection;
        sortCertificationName: SortDirection;
        sortEndDate: SortDirection;
      } = {
        limit: LIMIT_PER_PAGE,
        offset: (page - 1) * LIMIT_PER_PAGE,
        employeeName: name.trim() || null,
        departmentId: deptId,
        sortBy: sortByKey,
        sortEmployeeName: sortState.employeeName,
        sortCertificationName: sortState.certificationName,
        sortEndDate: sortState.endDate,
      };
      
      const response = await apiClient.get<EmployeeListResponse>('/employees', { params });
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployeeError('従業員を取得できません');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEmployees('', null, 1, DEFAULT_SORT, DEFAULT_SORT_BY);
  }, []);

  // Handle search
  const handleSearch = (name: string, deptId: number | null) => {
    setEmployeeName(name);
    setSelectedDepartmentId(deptId);
    setCurrentPage(1);
    fetchEmployees(name, deptId, 1, sort, sortBy);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEmployees(employeeName, selectedDepartmentId, page, sort, sortBy);
  };

  const handleSort = (key: SortKey) => {
    const nextSort: Record<SortKey, SortDirection> = {
      ...sort,
      [key]: sort[key] === 'asc' ? 'desc' : 'asc',
    };

    setSort(nextSort);
    setSortBy(key);
    setCurrentPage(1);
    fetchEmployees(employeeName, selectedDepartmentId, 1, nextSort, key);
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

