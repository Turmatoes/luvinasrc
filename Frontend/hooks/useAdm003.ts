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
import { ERR_SYSTEM, ERR_SUCCESS } from '@/lib/constants/config';
import { getAdm002ReturnUrl } from '@/lib/utils/queryHelper';

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
    // Điều hướng sang màn hình ADM004 kèm theo ID và giữ nguyên các tham số tìm kiếm/sắp xếp
    router.push(`/employees/adm004?id=${id}&${searchParams.toString()}`);
  };

  /**
   * Xử lý xóa nhân viên.
   */
  const handleDelete = async () => {
    if (window.confirm(MESSAGES.MSG004)) {
      setLoading(true);
      try {
        const res = await employeeApi.deleteEmployee(parseInt(id!));
        if (res.code === ERR_SUCCESS || res.code === '200' || res.code === 200) {
          // Thành công thì qua trang ADM006 (hoàn tất) với loại tác vụ là xóa
          router.push('/employees/adm006?type=delete');
        } else {
          redirectToSystemError(res.message?.code || res.code);
        }
      } catch (err: any) {
        console.error('Lỗi khi xóa nhân viên:', err);
        // Lấy ErrorResponse từ payload do axios ném ra (Http 500)
        const errorCode = err?.response?.data?.message?.code || err?.response?.data?.code || ERR_SYSTEM;
        redirectToSystemError(errorCode);
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
