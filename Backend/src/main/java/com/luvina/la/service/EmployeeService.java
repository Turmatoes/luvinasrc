/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeService.java, April 9, 2026 nxplong
 */

package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.EmployeeResponse;
import java.util.List;

/**
 * Giao diện (Interface) dịch vụ nhân viên.
 * Định nghĩa các phương thức xử lý logic kinh doanh cho nhân viên.
 */
public interface EmployeeService {

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
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
     * Escape ký tự đặc biệt trong tên nhân viên cho LIKE query.
     * Trả về null nếu tên rỗng.
     *
     * @param employeeName Tên nhân viên (đã trim)
     * @return Chuỗi đã được escape hoặc null
     */
    String escapeEmployeeName(String employeeName);

    /**
     * Đếm tổng số nhân viên không phải quản trị.
     */
    Long countNonAdminEmployees();

    /**
     * Đếm tổng số nhân viên không phải quản trị với bộ lọc.
     */
    Long countEmployeesWithFilter(String employeeName, Long departmentId);

    /**
     * Xây dựng phản hồi lỗi có hỗ trợ params.
     */
    EmployeeResponse buildErrorResponse(String errorCode, List<String> params);

    /**
     * Xây dựng phản hồi lỗi với params rỗng.
     */
    EmployeeResponse buildErrorResponse(String errorCode);

    /**
     * Lấy chi tiết nhân viên theo ID.
     */
    EmployeeDTO getEmployeeById(Long id);

    /**
     * Kiểm tra sự tồn tại của Login ID.
     */
    boolean checkExistsLoginId(String loginId);

    /**
     * Kiểm tra sự tồn tại của Phòng ban.
     */
    boolean checkExistsDepartment(Long departmentId);

    /**
     * Kiểm tra sự tồn tại của Chứng chỉ.
     */
    boolean checkExistsCertification(Long certificationId);

    /**
     * Thêm mới một nhân viên vào database.
     */
    EmployeeResponse addEmployee(EmployeeRequest request);
}
