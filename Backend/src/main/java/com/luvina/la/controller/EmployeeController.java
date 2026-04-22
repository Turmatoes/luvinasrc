/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.payload.EmployeeRequest;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
/**
 * Lớp EmployeeController xử lý các yêu cầu liên quản đến danh sách nhân viên.
 * 
 * @author nxplong
 */
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * Constructor khởi tạo EmployeeController.
     *
     * @param employeeService Dịch vụ xử lý nhân viên
     */
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Loại trừ nhân viên quản trị (role = 1).
     * 
     * @param employeeName          Tên nhân viên lôc (không bắt buộc)
     * @param departmentId          Mã phòng ban lôc (không bắt buộc)
     * @param limit                 Số bản ghi trên trang (mặc định: 5)
     * @param offset                Số trang (mặc định: 0)
     * @param sortEmployeeName      Sắp xếp theo tên nhân viên (asc/desc)
     * @param sortCertificationName Sắp xếp theo chứng chỉ (asc/desc)
     * @param sortEndDate           Sắp xếp theo ngày hết hạn (asc/desc)
     * @return EmployeeListResponse chứa tổng số bản ghi và danh sách nhân viên
     */
    @GetMapping("/employees")
    public EmployeeResponse getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = "asc") String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = "asc") String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = "asc") String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        try {
            String normalizedEmployeeName = employeeName == null ? "" : employeeName.trim();

            // 1. Validate parameter
            EmployeeResponse error = employeeService.validateListParams(
                    sortEmployeeName, sortCertificationName, sortEndDate, offset, limit, normalizedEmployeeName);
            if (error != null) {
                return error;
            }

            String escapedEmployeeName = employeeService.escapeEmployeeName(normalizedEmployeeName);

            // 2.1 Lấy tổng số nhân viên từ DB
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    escapedEmployeeName,
                    departmentId);

            List<EmployeeDTO> employees = new ArrayList<>();

            if (totalRecords > 0) {
                // 2.2 Lấy danh sách từ DB
                employees = employeeService.getListEmployee(
                        escapedEmployeeName,
                        departmentId,
                        sortEmployeeName.toLowerCase(),
                        sortCertificationName.toLowerCase(),
                        sortEndDate.toLowerCase(),
                        limit,
                        offset);
            }

            // 3. Tạo dữ liệu response thành công cho API
            EmployeeListResponse response = new EmployeeListResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là [] theo thiết kế

            return response;
        } catch (Exception e) {
            // 3. Xử lý lỗi 500 (System Error)
            return employeeService.buildErrorResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Lấy chi tiết một nhân viên.
     */
    @GetMapping("/employees/{id}")
    public Object getEmployeeDetail(@PathVariable("id") Long id) {
        try {
            EmployeeDTO employee = employeeService.getEmployeeById(id);
            if (employee == null) {
                // Không tìm thấy nhân viên (Mã lỗi ER013)
                return employeeService.buildErrorResponse(Constants.CODE_ER013);
            }
            return employee;
        } catch (Exception e) {
            return employeeService.buildErrorResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Validate dữ liệu nhân viên trước khi xác nhận.
     * Thực hiện các bước validate từ 1.1 đến 1.9.
     */
    @PostMapping("/employees/validate")
    public EmployeeResponse validateEmployee(@RequestBody EmployeeRequest request) {
        try {
            EmployeeResponse error;

            // 1.1 Validate [employee_login_id]
            error = employeeService.validateLoginId(request.getEmployeeLoginId());
            if (error != null)
                return error;

            // 1.2 Validate [employee_name]
            error = employeeService.validateEmployeeName(request.getEmployeeName());
            if (error != null)
                return error;

            // 1.3 Validate [employee_name_kana]
            error = employeeService.validateNameKana(request.getEmployeeNameKana());
            if (error != null)
                return error;

            // 1.4 Validate [employee_birth_date]
            error = employeeService.validateBirthDate(request.getEmployeeBirthDate());
            if (error != null)
                return error;

            // 1.5 Validate [employee_email]
            error = employeeService.validateEmail(request.getEmployeeEmail());
            if (error != null)
                return error;

            // 1.6 Validate [employee_telephone]
            error = employeeService.validateTelephone(request.getEmployeeTelephone());
            if (error != null)
                return error;

            // 1.7 Validate [employee_login_password]
            error = employeeService.validatePassword(request.getEmployeeLoginPassword());
            if (error != null)
                return error;

            // 1.7+ Validate [employee_login_password_confirm]
            error = employeeService.validatePasswordConfirm(request.getEmployeeLoginPassword(),
                    request.getEmployeeLoginPasswordConfirm());
            if (error != null)
                return error;

            // 1.8 Validate [department_id]
            error = employeeService.validateDepartment(request.getDepartmentId());
            if (error != null)
                return error;

            // 1.9 Validate Certification (nếu có chọn)
            error = employeeService.validateCertification(request);
            if (error != null)
                return error;

            return employeeService.buildErrorResponse(Constants.CODE_SUCCESS);
        } catch (Exception e) {
            return employeeService.buildErrorResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Thêm mới nhân viên.
     */
    @PostMapping("/employees")
    public EmployeeResponse addEmployee(@RequestBody EmployeeRequest request) {
        // Thực hiện lại validate trước khi lưu (giống endpoint validate)
        EmployeeResponse validateRes = validateEmployee(request);
        if (validateRes != null && !Constants.CODE_SUCCESS.equals(validateRes.getCode())) {
            return validateRes;
        }
        return employeeService.addEmployee(request);
    }
}
