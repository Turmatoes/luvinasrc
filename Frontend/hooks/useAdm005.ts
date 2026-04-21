/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm005.ts, April 21, 2026 nxplong
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeFormValues } from '@/types/employee';

// Key cho storage (phải match với ADM004)
const STORAGE_KEY = 'ADM004_FORM_DATA';

/**
 * Custom Hook useAdm005 quản lý logic cho màn hình Xác nhận Thông tin nhân viên (ADM005).
 * - Đọc dữ liệu từ sessionStorage (từ ADM004)
 * - Hiển thị dữ liệu confirm
 * - Xử lý nút OK (submit) và 戻る (back)
 * 
 * @returns Object chứa formData, departments, certifications, và handler functions
 */
export function useAdm005() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeFormValues | null>(null);
  const [departments, setDepartments] = useState<{[key: string]: string}>({});
  const [certifications, setCertifications] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  /**
   * Tải dữ liệu từ sessionStorage và setup mapping
   */
  useEffect(() => {
    setLoading(true);
    try {
      // Đọc dữ liệu từ sessionStorage
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      console.log('📋 [ADM005] useEffect triggered - Retrieved from sessionStorage:', savedData);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        console.log('✅ [ADM005] Form data loaded:', parsed);
      } else {
        console.log('⚠️ [ADM005] No sessionStorage data found - Redirecting to ADM004');
        router.push('/employees/adm004');
        return;
      }

      // Load mock departments & certifications để mapping id -> name
      // TODO: Load từ API khi cần thay vì mock data
      const mockDepts: {[key: string]: string} = {
        '1': 'IT',
        '2': 'QAT', 
        '3': 'HR',
        '4': 'Sales',
      };
      const mockCerts: {[key: string]: string} = {
        '1': 'N1',
        '2': 'N2',
        '3': 'N3',
        '4': 'N4',
        '5': 'N5',
      };
      setDepartments(mockDepts);
      setCertifications(mockCerts);
      console.log('✅ [ADM005] Mock departments and certifications loaded');
    } catch (err) {
      console.error('❌ [ADM005] Error loading data:', err);
      router.push('/employees/adm004');
    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Xử lý nút OK - Xác nhận và lưu dữ liệu
   */
  const handleConfirm = async () => {
    console.log('✅ [ADM005] Confirm button clicked - Submitting data');
    console.log('✅ [ADM005] Data to be submitted:', formData);
    
    try {
      // TODO: Call API để lưu dữ liệu vào database
      // const response = await employeeApi.addEmployee(formData);
      // hoặc: const response = await employeeApi.updateEmployee(id, formData);
      
      // Tạm thời chỉ simulate
      console.log('📤 [ADM005] Data submitted successfully');
      
      // Xóa sessionStorage vì đã submit xong
      sessionStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ [ADM005] sessionStorage cleared');
      
      // Navigate to success page
      router.push('/employees/adm006');
    } catch (err) {
      console.error('❌ [ADM005] Error submitting data:', err);
      // TODO: Show error message to user
    }
  };

  /**
   * Xử lý nút 戻る - Quay lại ADM004 mà giữ sessionStorage
   */
  const handleBack = () => {
    console.log('⬅️ [ADM005] Back button clicked - Returning to ADM004');
    console.log('⬅️ [ADM005] sessionStorage preserved:', sessionStorage.getItem(STORAGE_KEY));
    
    // Không xóa sessionStorage - dữ liệu sẽ được khôi phục lại ở ADM004
    router.push('/employees/adm004');
  };

  return {
    formData,
    departments,
    certifications,
    loading,
    handleConfirm,
    handleBack,
  };
}
