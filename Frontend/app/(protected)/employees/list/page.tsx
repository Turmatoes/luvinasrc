'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { EmployeeListResponse, DepartmentDTO } from '@/types/employee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';

export default function EmployeeListPage() {
  useAuth();
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [employeeName, setEmployeeName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<DepartmentDTO[]>('/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch employees when filters change
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {};
        
        if (employeeName.trim()) {
          params.employeeName = employeeName;
        }
        
        if (selectedDepartmentId !== null) {
          params.departmentId = selectedDepartmentId;
        }
        
        const response = await apiClient.get<EmployeeListResponse>('/employees', { params });
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employeeName, selectedDepartmentId]);

  const handleSearch = () => {
    // Trigger re-fetch by updating state (already handled by useEffect)
  };

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
  };

  const handleEmployeeNameChange = (name: string) => {
    setEmployeeName(name);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Không có dữ liệu</div>;

  return (
    <>
      <SearchForm 
        departments={departments}
        selectedDepartmentId={selectedDepartmentId}
        employeeName={employeeName}
        onDepartmentChange={handleDepartmentChange}
        onEmployeeNameChange={handleEmployeeNameChange}
        onSearch={handleSearch}
      />
      <EmployeeTable data={data} />
      <Pagination />
    </>
  );
}

