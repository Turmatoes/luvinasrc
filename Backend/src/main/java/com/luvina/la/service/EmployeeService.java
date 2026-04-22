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
     * Validate các tham số cho API lấy danh sách nhân viên.
     * - Kiểm tra sort hợp lệ (asc/desc) (ER021)
     * - Kiểm tra offset là số nguyên không âm (ER018)
     * - Kiểm tra limit là số nguyên không âm (ER018)
     * - Kiểm tra độ dài tên nhân viên (ER006)
     *
     * @param sortEmployeeName      Chiều sắp xếp theo tên
     * @param sortCertificationName Chiều sắp xếp theo chứng chỉ
     * @param sortEndDate           Chiều sắp xếp theo ngày hết hạn
     * @param offset                Số trang
     * @param limit                 Số bản ghi mỗi trang
     * @param employeeName          Tên nhân viên tìm kiếm
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateListParams(
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer offset,
            Integer limit,
            String employeeName);

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

    /**
     * 1.1 Validate [employee_login_id].
     * Kiểm tra bắt buộc, độ dài tối đa, định dạng hợp lệ và không trùng lặp.
     *
     * @param loginId Mã đăng nhập cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateLoginId(String loginId);

    /**
     * 1.2 Validate [employee_name].
     * Kiểm tra bắt buộc và độ dài tối đa.
     *
     * @param name Tên nhân viên cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateEmployeeName(String name);

    /**
     * 1.3 Validate [employee_name_kana].
     * Kiểm tra bắt buộc, độ dài tối đa và định dạng Katakana.
     *
     * @param nameKana Tên Katakana cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateNameKana(String nameKana);

    /**
     * 1.4 Validate [employee_birth_date].
     * Kiểm tra bắt buộc và định dạng ngày sinh yyyy/MM/dd.
     *
     * @param birthDate Ngày sinh cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateBirthDate(String birthDate);

    /**
     * 1.5 Validate [employee_email].
     * Kiểm tra bắt buộc, độ dài tối đa và định dạng email.
     *
     * @param email Email cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateEmail(String email);

    /**
     * 1.6 Validate [employee_telephone].
     * Kiểm tra bắt buộc, độ dài tối đa và định dạng số điện thoại (chỉ số half-size).
     *
     * @param telephone Số điện thoại cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateTelephone(String telephone);

    /**
     * 1.7 Validate [employee_login_password].
     * Kiểm tra bắt buộc và độ dài trong khoảng [min, max].
     *
     * @param password Mật khẩu cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validatePassword(String password);

    /**
     * 1.8 Validate [employee_login_password_confirm].
     * Kiểm tra mật khẩu xác nhận phải khớp với mật khẩu gốc.
     *
     * @param password        Mật khẩu gốc
     * @param passwordConfirm Mật khẩu xác nhận
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validatePasswordConfirm(String password, String passwordConfirm);

    /**
     * 1.9 Validate [department_id].
     * Kiểm tra bắt buộc và phải tồn tại trong database.
     *
     * @param departmentId ID phòng ban cần kiểm tra
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateDepartment(Long departmentId);

    /**
     * 2.0 Validate Certification (nếu có chọn).
     * Kiểm tra sự tồn tại, ngày tháng hợp lệ (start < end) và điểm số.
     *
     * @param request Toàn bộ request chứa thông tin chứng chỉ
     * @return null nếu hợp lệ, EmployeeResponse chứa mã lỗi nếu không hợp lệ
     */
    EmployeeResponse validateCertification(EmployeeRequest request);
}
