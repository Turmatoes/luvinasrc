/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm005.ts, May 08, 2026 nxplong
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

// Key cho storage (phải match với ADM004 để lấy dữ liệu đã nhập)
const STORAGE_KEY = getStorageKey('ADM004');

/**
 * Custom Hook useAdm005 quản lý logic cho màn hình Xác nhận (ADM005).
 */
export function useAdm005() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get(PARAM_ID);

    const [formData, setFormData] = useState<EmployeeFormValues | null>(null);
    const [departments, setDepartments] = useState<{ [key: string]: string }>({});
    const [certifications, setCertifications] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);

    // ---------------------------------------------------------
    // 6.1 HIỂN THỊ BAN ĐẦU
    // ---------------------------------------------------------

    // Khởi tạo Master data và lấy dữ liệu nhân viên từ session storage khi màn hình được load
    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            try {
                // Xác định MH là confirm cho edit hay add dựa trên ID trong router (6.1)
                // 1. Tải Master data (Phòng ban, Chứng chỉ) để binding tên hiển thị vì session storage chỉ lưu ID
                const [depts, certs] = await Promise.all([
                    departmentApi.getDepartments(),
                    certificationApi.getCertifications(),
                ]);

                const deptMap: { [key: string]: string } = {};
                depts.forEach(d => { deptMap[d.departmentId.toString()] = d.departmentName; });
                setDepartments(deptMap);

                const certMap: { [key: string]: string } = {};
                certs.forEach(c => { certMap[c.certificationId.toString()] = c.certificationName; });
                setCertifications(certMap);

                // 2. Binding data từ MH edit/add gửi sang lên màn hình (Lấy từ session storage)
                const employeeData = getSessionData(STORAGE_KEY);
                if (employeeData) {
                    setFormData(employeeData);
                } else {
                    // Nếu không có dữ liệu (truy cập trực tiếp qua URL), chuyển đến màn hình System Error
                    redirectToSystemError(ERR_SYSTEM);
                }
            } catch (err) {
                console.error('Lỗi khởi tạo ADM005:', err);
                redirectToSystemError(ERR_SYSTEM);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [id]);

    // ---------------------------------------------------------
    // 6.2 ACTION UPDATE (Nút OK)
    // ---------------------------------------------------------

    const handleOK = async () => {
        if (!formData) return;

        setLoading(true);
        try {
            // Gọi API add nếu là MH confirm Add hoặc update nếu là MH confirm edit
            let res;
            if (id) {
                res = await employeeApi.updateEmployee(parseInt(id), formData);
            } else {
                res = await employeeApi.addEmployee(formData);
            }

            // Kiểm tra kết quả trả về từ API
            if (res.code === ERR_SUCCESS) {
                // TH API trả về thành công: Di chuyển sang MH complete ADM006
                const nextPath = `/employees/adm006?${PARAM_TYPE}=${id ? MODE_EDIT : MODE_ADD}`;
                router.push(nextPath);
            } else {
                // TH API trả về lỗi: chuyển hướng đến màn System Error và hiển thị lỗi
                redirectToSystemError(res.code, res.message);
            }
        } catch (err) {
            console.error('Lỗi khi lưu dữ liệu:', err);
            redirectToSystemError(ERR_SYSTEM);
        } finally {
            // Luôn xóa session data trước khi chuyển trang hoặc báo lỗi hệ thống
            clearSessionData(STORAGE_KEY);
            setLoading(false);
        }
    };

    // ---------------------------------------------------------
    // 6.3 ACTION CANCEL (Nút 戻る)
    // ---------------------------------------------------------

    const handleBack = () => {
        // Redirect về MH add/edit ADM004: gửi lại data đã truyền sang về MH add/edit ADM004 qua router
        const params = new URLSearchParams(searchParams.toString());
        params.set(PARAM_MODE, MODE_BACK);
        if (id) params.set(PARAM_ID, id);

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
