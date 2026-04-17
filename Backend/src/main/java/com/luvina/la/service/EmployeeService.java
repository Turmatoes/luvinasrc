/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeService.java, April 9, 2026 nxplong
 */

package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import java.util.List;

/**
 * Gào diền (Interface) dịch vụ nhân viên.
 * Định nghĩa các phương thức xử lý logic kinh doanh cho nhân viên.
 */
public interface EmployeeService {

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Loại trừ nhân viên quản trị (role = 1).
     * 
     * @param employeeName Tên nhân viên lôc (không bắt buộc)
     * @param departmentId Mã phòng ban lôc (không bắt buộc)
     * @param limit        Số bản ghi trên trang
     * @param offset       Số trang
     * @return Danh sách EmployeeDTO
     */
    List<EmployeeDTO> getListEmployee(
            String employeeName,
            Long departmentId,
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer limit,
            Integer offset);

    /**
     * Đếm tổng số nhân viên không phải quản trị.
     * 
     * @return Tổng số nhân viên có role = 0 hoặc role IS NULL
     */
    Long countNonAdminEmployees();

    /**
     * Đếm tổng số nhân viên không phải quản trị với bộ lọc.
     * 
     * @param employeeName Tên nhân viên lôc (không bắt buộc)
     * @param departmentId Mã phòng ban lôc (không bắt buộc)
     * @return Tổng số nhân viên có role = 0 hoặc role IS NULL theo bộ lọc
     */
    Long countEmployeesWithFilter(String employeeName, Long departmentId);

    /**
     * Xây dựng phản hồi lỗi có hỗ trợ params.
     * 
     * @param code Mã lỗi (ví dụ: ER021)
     * @param messageCode Mã lỗi thông điệp
     * @param params Danh sách tham số (có thể null)
     * @return EmployeeListResponse chứa lỗi
     */
    EmployeeListResponse buildErrorResponse(String code, String messageCode, List<String> params);

    /**
     * Xây dựng phản hồi lỗi với params rỗng.
     * 
     * @param errorCode Mã lỗi
     * @return EmployeeListResponse chứa lỗi
     */
    EmployeeListResponse buildErrorResponse(String errorCode);
}
