/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm005.ts, April 21, 2026 nxplong
 */
'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { EmployeeFormValues } from '@/types/employee';

import { getStorageKey, getSessionData, clearSessionData } from '@/lib/utils/sessionStorage';

// Key cho storage (phải match với ADM004)
const STORAGE_KEY = getStorageKey('ADM004');

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
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [formData, setFormData] = useState<EmployeeFormValues | null>(null);
    const [departments, setDepartments] = useState<{ [key: string]: string }>({});
    const [certifications, setCertifications] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);

    /**
     * Thực hiện lấy dữ liệu từ sessionStorage hiển thị lên màn hình adm005
     */
    useEffect(() => {
        setLoading(true);
        try {
            // Đọc dữ liệu từ sessionStorage
            const employeeData = getSessionData(STORAGE_KEY);
            if (employeeData) {
                setFormData(employeeData);
            } else {
                // redirect lại màn hình adm004 nếu như không có dữ liệu trên sessionStorage
                router.push('/employees/adm004');
                return;
            }
        } catch (err) {
            // redirect lại màn hình adm004 nếu có lỗi xảy ra
            router.push('/employees/adm004');
        } finally {
            setLoading(false);
        }
    }, [router]);

    /**
     * Xử lý nút OK - Xác nhận và lưu dữ liệu
     */
    const handleConfirm = async () => {
        try {
            // Xóa sessionStorage khi nhấn OK và đẩy dữ liệu vào DB
            clearSessionData(STORAGE_KEY);
            router.push('/employees/adm006');
        } catch (err) {
        }
    };

    /**
     * Xử lý nút 戻る - Quay lại ADM004 + giữ sessionStorage
     */
    const handleBack = () => {
        // Không xóa sessionStorage - dữ liệu sẽ được khôi phục lại ở ADM004
        // Thêm mode=back để ADM004 biết là quay về từ ADM005
        router.push(`/employees/adm004?mode=back${id ? '&id=' + id : ''}`);
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
