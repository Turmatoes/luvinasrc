/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeService.java, April 9, 2026 nxplong
 */

package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.ErrorResponse;
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
     * 
     * @param employeeName Tên nhân viên (đã trim)
     * @param departmentId ID phòng ban
     * @return Số lượng nhân viên không phải quản trị
     */
    Long countEmployeesWithFilter(String employeeName, Long departmentId);

    /**
     * Lấy chi tiết nhân viên theo ID.
     * 
     * @param id ID của nhân viên
     * @return EmployeeDTO chứa thông tin nhân viên
     */
    EmployeeDTO getEmployeeById(Long id);

    /**
     * Kiểm tra sự tồn tại của Login ID.
     * 
     * @param loginId Login ID cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    boolean checkExistsLoginId(String loginId);

    /**
     * Kiểm tra sự tồn tại của Phòng ban.
     * 
     * @param departmentId ID phòng ban cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    boolean checkExistsDepartment(Long departmentId);

    /**
     * Kiểm tra sự tồn tại của Chứng chỉ.
     * 
     * @param certificationId ID chứng chỉ cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    boolean checkExistsCertification(Long certificationId);

    /**
     * Thêm mới một nhân viên vào database.
     * 
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return EmployeeResponse chứa mã lỗi (SUCCESS hoặc mã lỗi cụ thể)
     */
    ErrorResponse addEmployee(EmployeeRequest request);

    /**
     * Cập nhật nhân viên.
     * 
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return ErrorResponse chứa mã lỗi
     */
    ErrorResponse updateEmployee(EmployeeRequest request);

    /**
     * Xóa nhân viên.
     * 
     * @param employeeId ID của nhân viên cần xóa
     * @return ErrorResponse chứa kết quả xóa
     */
    ErrorResponse deleteEmployee(Long employeeId);
}
