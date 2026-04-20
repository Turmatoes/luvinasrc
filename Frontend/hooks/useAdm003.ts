/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm003.ts, April 20, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { getMessage } from '@/lib/utils/messageHelper';
import { MESSAGES } from '@/lib/constants/messages';

/**
 * Custom Hook useAdm003 quản lý logic cho màn hình Chi tiết nhân viên.
 * 
 * @returns Object chứa dữ liệu nhân viên, trạng thái loading và các hàm điều hướng
 */
export function useAdm003() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tải thông tin chi tiết nhân viên từ Backend.
   */
  const fetchDetail = useCallback(async () => {
    if (!id) {
      setError('ID nhân viên không hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      const data = await employeeApi.getEmployeeDetail(parseInt(id));
      setEmployee(data);
    } catch (err) {
      console.error('Failed to fetch employee detail:', err);
      setError(getMessage('ER023'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /**
   * Điều hướng sang màn hình chỉnh sửa.
   */
  const handleEdit = () => {
    router.push(`/employees/adm004?id=${id}`);
  };

  /**
   * Xử lý xóa nhân viên.
   */
  const handleDelete = async () => {
    if (window.confirm(MESSAGES.MSG004)) {
       // Logic xóa sẽ được triển khai sau khi có API
       console.log('Deleting employee:', id);
       router.push('/employees/adm006');
    }
  };

  /**
   * Quay lại màn hình danh sách.
   */
  const handleBack = () => {
    router.push('/employees/adm002');
  };

  return {
    employee,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleBack,
  };
}
