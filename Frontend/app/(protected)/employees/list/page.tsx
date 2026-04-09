'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { EmployeeListResponse } from '@/types/employee';
import SearchForm from '@/components/employees/SearchForm';
import EmployeeTable from '@/components/employees/EmployeeTable';
import Pagination from '@/components/employees/Pagination';

export default function EmployeeListPage() {
  useAuth();
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiClient.get<EmployeeListResponse>('/employees');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Không có dữ liệu</div>;

  return (
    <>
      <SearchForm />
      <EmployeeTable data={data} />
      <Pagination />
    </>
  );
}

