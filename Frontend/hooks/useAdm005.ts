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
import { departmentApi } from '@/lib/api/department.api';
import { certificationApi } from '@/lib/api/certification.api';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { ERR_SYSTEM, ERR_SUCCESS, MODE_ADD, MODE_EDIT, PARAM_ID, PARAM_TYPE, PARAM_MODE, MODE_BACK } from '@/lib/constants/config';

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
    const id = searchParams.get(PARAM_ID);
    const [formData, setFormData] = useState<EmployeeFormValues | null>(null);
    const [departments, setDepartments] = useState<{ [key: string]: string }>({});
    const [certifications, setCertifications] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);

    /**
     * Thực hiện lấy dữ liệu từ sessionStorage và Master data (Phòng ban, Chứng chỉ)
     */
    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            try {
                // 1. Tải dữ liệu danh mục để hiển thị Tên thay vì ID
                const [depts, certs] = await Promise.all([
                    departmentApi.getDepartments(),
                    certificationApi.getCertifications(),
                ]);

                // Chuyển đổi danh sách sang Object Map để lookup nhanh theo ID
                const deptMap: { [key: string]: string } = {};
                depts.forEach(d => {
                    deptMap[d.departmentId.toString()] = d.departmentName;
                });
                setDepartments(deptMap);

                const certMap: { [key: string]: string } = {};
                certs.forEach(c => {
                    certMap[c.certificationId.toString()] = c.certificationName;
                });
                setCertifications(certMap);

                // 2. Đọc dữ liệu nhân viên từ sessionStorage (do ADM004 truyền sang)
                const employeeData = getSessionData(STORAGE_KEY);
                if (employeeData) {
                    setFormData(employeeData);
                } else {
                    // Nếu không có dữ liệu (truy cập trực tiếp qua URL), chuyển đến màn hình System Error
                    redirectToSystemError(ERR_SYSTEM);
                }
            } catch (err) {
                console.error('Lỗi khởi tạo ADM005:', err);
                // Redirect sang màn hình System Error nếu có lỗi xảy ra
                redirectToSystemError(ERR_SYSTEM);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [router]);

    /**
     * Xử lý nút OK - Đẩy dữ liệu vào DB và chuyển hướng sang ADM006
     */
    const handleOK = async () => {
        if (!formData) return;

        setLoading(true);
        try {
            // Validation đã được thực hiện bên trong các API này tại Backend
            let res;
            if (id) {
                res = await employeeApi.updateEmployee(parseInt(id), formData);
            } else {
                res = await employeeApi.addEmployee(formData);
            }

            // Kiểm tra kết quả trả về từ API
            if (res.code !== ERR_SUCCESS) {
                // Nếu có lỗi (bao gồm cả lỗi validate hoặc lỗi hệ thống), chuyển hướng sang màn hình lỗi
                redirectToSystemError(res.code, res.message);
                return;
            }

            // Xóa sessionStorage khi hoàn tất thành công và chuyển sang màn hình thông báo (ADM006)
            // Truyền type để ADM006 biết hiển thị thông báo "Đăng ký" hay "Cập nhật"
            clearSessionData(STORAGE_KEY);
            const nextPath = `/employees/adm006?${PARAM_TYPE}=${id ? MODE_EDIT : MODE_ADD}`;
            router.push(nextPath);
        } catch (err) {
            console.error('Lỗi khi lưu dữ liệu:', err);
            // Redirect sang màn hình system_error với mã lỗi ER014
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
        const params = new URLSearchParams(searchParams.toString());
        // Thêm mode=back để ADM004 biết là quay về từ ADM005
        params.set(PARAM_MODE, MODE_BACK);
        // Đảm bảo ID được set đúng (nếu có)
        if (id) {
            params.set(PARAM_ID, id);
        }

        router.push(`/employees/adm004?${params.toString()}`);
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
