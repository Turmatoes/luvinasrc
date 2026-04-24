/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.ErrorResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validate.EmployeeValidate;
import com.luvina.la.payload.EmployeeDetailResponse;
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
    private final EmployeeValidate employeeValidate;

    /**
     * Constructor khởi tạo EmployeeController.
     *
     * @param employeeService  Dịch vụ xử lý nhân viên
     * @param employeeValidate Dịch vụ validate nhân viên
     */
    public EmployeeController(EmployeeService employeeService, EmployeeValidate employeeValidate) {
        this.employeeService = employeeService;
        this.employeeValidate = employeeValidate;
    }

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Loại trừ nhân viên quản trị (role = 1).
     * 
     * @param employeeName          Tên nhân viên lôc (không bắt buộc)
     * @param departmentId          Mã phòng ban lôc (không bắt buộc)
     * @param limit                 Số bản ghi trên trang (mặc định: 20)
     * @param offset                Số trang (mặc định: 0)
     * @param sortEmployeeName      Sắp xếp theo tên nhân viên (asc/desc)
     * @param sortCertificationName Sắp xếp theo chứng chỉ (asc/desc)
     * @param sortEndDate           Sắp xếp theo ngày hết hạn (asc/desc)
     * @return EmployeeListResponse chứa tổng số bản ghi và danh sách nhân viên
     */
    @GetMapping("/employees")
    public ErrorResponse getEmployeeList(
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
            ErrorResponse employeeResponse = employeeValidate.validateListParams(
                    sortEmployeeName, sortCertificationName, sortEndDate, offset, limit, normalizedEmployeeName);
            if (employeeResponse != null) {
                return employeeResponse;
            }

            String escapedEmployeeName = employeeService.escapeEmployeeName(normalizedEmployeeName);

            // 2.1 Lấy tổng số nhân viên từ DB
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    escapedEmployeeName,
                    departmentId);

            // 2.2 Nếu không có bản ghi nào, trả về response rỗng
            if (totalRecords == 0) {
                EmployeeListResponse emptyResponse = new EmployeeListResponse();
                emptyResponse.setCode(Constants.CODE_SUCCESS);
                emptyResponse.setTotalRecords(0L);
                emptyResponse.setEmployees(new ArrayList<>());
                return emptyResponse;
            }

            // 2.3 Lấy danh sách nhân viên thực tế theo phân trang
            List<EmployeeDTO> employees = employeeService.getListEmployee(
                    escapedEmployeeName,
                    departmentId,
                    sortEmployeeName,
                    sortCertificationName,
                    sortEndDate,
                    limit,
                    offset);

            // 3. Tạo dữ liệu response thành công cho API
            EmployeeListResponse response = new EmployeeListResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là [] theo thiết kế

            return response;

        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return employeeService.buildResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Lấy chi tiết một nhân viên hiển thị lên màn adm003
     * 
     * @param id ID của nhân viên
     * @return EmployeeDetailResponse chứa thông tin nhân viên hoặc mã lỗi
     */
    @GetMapping("/employees/{id}")
    public ErrorResponse getEmployeeDetail(@PathVariable("id") Long id) {
        try {
            EmployeeDTO employee = employeeService.getEmployeeById(id);
            if (employee == null) {
                // Không tìm thấy nhân viên (Mã lỗi ER013)
                return employeeService.buildResponse(Constants.CODE_ER013);
            }

            // Tạo dữ liệu response thành công
            EmployeeDetailResponse response = new EmployeeDetailResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setEmployeeDTO(employee);
            return response;

        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return employeeService.buildResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Validate dữ liệu nhân viên trước khi xác nhận.
     * Thực hiện các bước validate thông qua EmployeeValidate.
     */
    @PostMapping("/employees/validate")
    public ErrorResponse validateEmployee(@RequestBody EmployeeRequest request) {
        try {
            return employeeValidate.validateEmployee(request);
        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return employeeValidate.buildResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Thêm mới nhân viên.
     */
    @PostMapping("/employees")
    public ErrorResponse addEmployee(@RequestBody EmployeeRequest request) {
        // Thực hiện lại validate trước khi lưu vào DB
        ErrorResponse validateEmployee = validateEmployee(request);
        if (validateEmployee != null && !Constants.CODE_SUCCESS.equals(validateEmployee.getCode())) {
            return validateEmployee;
        }
        return employeeService.addEmployee(request);
    }
}
