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
import { employeeApi } from '@/lib/api/employee.api';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { ERR_SYSTEM, ERR_SUCCESS } from '@/lib/constants/config';

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
     * Xử lý nút OK - Đẩy dữ liệu vào DB và chuyển hướng sang ADM006
     */
    const handleOK = async () => {
        if (!formData) return;

        setLoading(true);
        try {
            // LUỒNG 1: THỰC HIỆN VALIDATE LẠI TOÀN BỘ TẠI BACKEND
            // Đảm bảo dữ liệu vẫn hợp lệ ngay trước thời điểm lưu (phòng trường hợp trùng ID phát sinh giữa chừng)
            const validateRes = await employeeApi.validateEmployee(formData);

            if (validateRes.code !== ERR_SUCCESS) {
                // Nếu phát sinh bất kỳ lỗi validate nào ở bước cuối cùng, coi như là lỗi hệ thống nghiệp vụ
                redirectToSystemError(validateRes.code, validateRes.message);
                return;
            }

            // LUỒNG 2: HOÀN THÀNH TÁC VỤ VÀ ĐẨY DỮ LIỆU VÀO DB
            // Tùy theo mode (Add/Edit) để gọi API tương ứng
            if (id) {
                await employeeApi.updateEmployee(parseInt(id), formData);
            } else {
                await employeeApi.addEmployee(formData);
            }

            // Xóa sessionStorage khi hoàn tất thành công và chuyển sang màn hình thông báo (ADM006)
            clearSessionData(STORAGE_KEY);
            router.push('/employees/adm006');
        } catch (err) {
            console.error('Lỗi khi lưu dữ liệu:', err);
            //Gọi đến System Error khi gặp lỗi
            redirectToSystemError(ERR_SYSTEM);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Xử lý nút 戻る - Quay lại ADM004 (GIỮ session để khôi phục)
     */
    const handleBack = () => {
        // Không xóa session ở đây - để ADM004 đọc và xóa sau
        // Thêm mode=back để ADM004 biết là quay về từ ADM005
        router.push(`/employees/adm004?mode=back${id ? '&id=' + id : ''}`);
    };

    return {
        formData,
        departments,
        certifications,
        loading,
        handleOK,
        handleBack,
    };
}
