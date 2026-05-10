/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm003.ts, May 08, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { MESSAGES } from '@/lib/constants/messages';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { ERR_SYSTEM, ERR_SUCCESS, PARAM_ID, PARAM_TYPE, MODE_DELETE, PARAM_MODE } from '@/lib/constants/config';
import { getAdm002ReturnUrl } from '@/lib/utils/queryHelper';
import { getStorageKey, clearSessionData } from '@/lib/utils/sessionStorage';

/**
 * Custom Hook useAdm003 quản lý logic cho màn hình Chi tiết nhân viên (ADM003).
 */
export function useAdm003() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get(PARAM_ID);

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // 4.1 HIỂN THỊ BAN ĐẦU
  // ---------------------------------------------------------
  
  /**
   * Kiểm tra ID và tải thông tin chi tiết nhân viên từ Backend.
   */
  const fetchDetail = useCallback(async () => {
    // Kiểm tra xem ID có hợp lệ không (dạng số)
    if (!id || isNaN(Number(id))) {
      // Nếu ko có hoặc ko hợp lệ redirect sang màn hình system error
      redirectToSystemError(ERR_SYSTEM);
      return;
    }

    setLoading(true);
    try {
      const res = await employeeApi.getEmployeeDetail(parseInt(id));

      if (res.code === ERR_SUCCESS) {
        // TH API trả về 200: Binding data employee vào các hạng mục
        setEmployee(res.employeeDTO);
      } else {
        // TH API trả về lỗi hoặc ko tồn tại data: Di chuyển sang màn hình system error
        redirectToSystemError(res.code);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu nhân viên:', err);
      redirectToSystemError(ERR_SYSTEM);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Khởi tạo dữ liệu khi màn hình được load
  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // ---------------------------------------------------------
  // 4.2 ACTION CANCEL (Nút Back)
  // ---------------------------------------------------------
  
  /**
   * Quay lại màn hình danh sách ADM002, giữ nguyên trạng thái tìm kiếm/phân trang.
   */
  const handleBack = () => {
    router.push(getAdm002ReturnUrl(searchParams));
  };

  // ---------------------------------------------------------
  // 4.3 ACTION EDIT
  // ---------------------------------------------------------

  /**
   * Chuyển sang màn hình chỉnh sửa ADM004.
   */
  const handleEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM_ID, id!);
    params.delete(PARAM_MODE); // Xóa mode để ADM004 fetch lại data mới nhất
    
    // Di chuyển sang MH ADM004 gửi kèm ID tương ứng qua router
    router.push(`/employees/adm004?${params.toString()}`);
  };

  // ---------------------------------------------------------
  // 4.4 ACTION DELETE
  // ---------------------------------------------------------

  /**
   * Xử lý xóa nhân viên.
   */
  const handleDelete = async () => {
    // Hiển thị message confirm MSG004
    if (window.confirm(MESSAGES.MSG004)) {
      setLoading(true);
      try {
        // Gọi API để xóa data nhân viên trong database
        const res = await employeeApi.deleteEmployee(parseInt(id!));
        
        if (res.code === ERR_SUCCESS) {
          // TH API trả về thành công: Di chuyển sang MH complete (ADM006)
          router.push(`/employees/adm006?${PARAM_TYPE}=${MODE_DELETE}`);
        } else {
          // TH API trả về lỗi: Hiển thị ở vùng thông báo lỗi hoặc system error tùy mã trả về
          redirectToSystemError(res.code);
        }
      } catch (err) {
        redirectToSystemError(ERR_SYSTEM);
      } finally {
        setLoading(false);
      }
    }
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
