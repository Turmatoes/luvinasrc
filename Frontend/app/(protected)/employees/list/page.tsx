'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';

const LIMIT_PER_PAGE = 20;

export default function EmployeeListPage() {
  useAuth();
  
  // Data state
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  
  // Search filter state - Keep separate for managed search
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
  const fetchEmployees = async (name: string, deptId: number | null, page: number) => {
    setLoading(true);
    setEmployeeError(null);
    try {
      const params: Record<string, any> = {
        limit: LIMIT_PER_PAGE,
        offset: (page - 1) * LIMIT_PER_PAGE,
      };
      
      // Only add parameters if they have values
      if (name.trim()) {
        params.employeeName = name.trim();
      }
      
      if (deptId !== null) {
        params.departmentId = deptId;
      }
      
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

  // Initial load - fetch employees on first mount
  useEffect(() => {
    fetchEmployees('', null, 1);
  }, []);

  // Handle search button click - reset page and fetch
  const handleSearch = (name: string, deptId: number | null) => {
    setEmployeeName(name);
    setSelectedDepartmentId(deptId);
    setCurrentPage(1);
    fetchEmployees(name, deptId, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEmployees(employeeName, selectedDepartmentId, page);
  };

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
  };

  const handleEmployeeNameChange = (name: string) => {
    setEmployeeName(name);
  };

  // Determine if pagination should be shown
  const shouldShowPagination = data && data.totalRecords > LIMIT_PER_PAGE;
  const totalPages = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;

  return (
    <>
      {/* Show department fetch error if exists */}
      {departmentError && (
        <div className="alert alert-danger" role="alert">
          {departmentError}
        </div>
      )}
      
      {/* Show employee fetch error if exists */}
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
          <EmployeeTable data={data} />
          
          {shouldShowPagination && (
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

