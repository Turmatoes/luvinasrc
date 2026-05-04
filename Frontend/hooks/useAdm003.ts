/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm003.ts, April 20, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { MESSAGES } from '@/lib/constants/messages';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { ERR_SYSTEM, ERR_SUCCESS, PARAM_ID, PARAM_TYPE, MODE_DELETE } from '@/lib/constants/config';
import { getAdm002ReturnUrl } from '@/lib/utils/queryHelper';

/**
 * Custom Hook useAdm003 quản lý logic cho màn hình Chi tiết nhân viên.
 * 
 * @returns Object chứa dữ liệu nhân viên, trạng thái loading và các hàm điều hướng
 */
export function useAdm003() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get(PARAM_ID);

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tải thông tin chi tiết nhân viên từ Backend.
   */
  const fetchDetail = useCallback(async () => {
    if (!id) {
      // Redirect sang màn hình system_error với mã lỗi ER013
      redirectToSystemError(ERR_SYSTEM);
      return;
    }

    setLoading(true);
    try {
      const res = await employeeApi.getEmployeeDetail(parseInt(id));

      if (res.code === ERR_SUCCESS) {
        // res lúc này là EmployeeDetailResponse, chứa employeeDTO
        setEmployee(res.employeeDTO);
      } else {
        // Xử lý lỗi từ Backend (ER013, ER023...)
        // Redirect sang màn hình system_error với mã lỗi tương ứng
        redirectToSystemError(res.code);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu nhân viên:', err);
      redirectToSystemError(ERR_SYSTEM);
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
    router.push(`/employees/adm004?${PARAM_ID}=${id}&${searchParams.toString()}`);
  };

  /**
   * Xử lý xóa nhân viên.
   */
  const handleDelete = async () => {
    if (window.confirm(MESSAGES.MSG004)) {
      setLoading(true);
      try {
        const res = await employeeApi.deleteEmployee(parseInt(id!));
        if (res.code === ERR_SUCCESS) {
          router.push(`/employees/adm006?${PARAM_TYPE}=${MODE_DELETE}`);
        } else {
          redirectToSystemError(res.code);
        }
      } catch (err) {
        redirectToSystemError(ERR_SYSTEM);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Quay lại màn hình danh sách.
   */
  const handleBack = () => {
    // Quay lại màn hình danh sách và giữ nguyên trạng thái tìm kiếm/sắp xếp
    router.push(getAdm002ReturnUrl(searchParams));
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
