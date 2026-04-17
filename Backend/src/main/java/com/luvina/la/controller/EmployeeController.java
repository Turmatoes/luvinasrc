/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validate.EmployeeValidation;
import com.luvina.la.config.Constants;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api")
/**
 * Lớp EmployeeController xử lý các yêu cầu liên quản đến danh sách nhân viên.
 * 
 * @author nxplong
 */
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeValidation employeeValidation;

    /**
     * Constructor khởi tạo EmployeeController.
     *
     * @param employeeService Dịch vụ xử lý nhân viên
     * @param employeeValidation Xử lý kiểm tra dữ liệu đầu vào
     */
    public EmployeeController(EmployeeService employeeService, EmployeeValidation employeeValidation) {
        this.employeeService = employeeService;
        this.employeeValidation = employeeValidation;
    }

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Loại trừ nhân viên quản trị (role = 1).
     * 
     * @param employeeName Tên nhân viên lôc (không bắt buộc)
     * @param departmentId Mã phòng ban lôc (không bắt buộc)
     * @param limit        Số bản ghi trên trang (mặc định: 5)
     * @param offset       Số trang (mặc định: 0)
     * @return EmployeeListResponse chứa tổng số bản ghi và danh sách nhân viên
     */
    @GetMapping("/employees")
    public EmployeeListResponse getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = "asc") String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = "desc") String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = "asc") String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        try {
            // 1. Validate tham số sắp xếp (Sort)
            if (!employeeValidation.isValidSort(sortEmployeeName) || !employeeValidation.isValidSort(sortCertificationName) || !employeeValidation.isValidSort(sortEndDate)) {
                return employeeService.buildErrorResponse(Constants.CODE_ER021);
            }

            // 2.1 Lấy tổng số nhân viên
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    employeeName.isEmpty() ? null : employeeName,
                    departmentId);

            List<EmployeeDTO> employees = new ArrayList<>();

            if (totalRecords > 0) {
                // Kiểm tra tính hợp lệ của Offset (ER022)
                if (offset >= totalRecords) {
                    return employeeService.buildErrorResponse(Constants.CODE_ER022);
                }

                // 2.2 Lấy danh sách từ DB
                employees = employeeService.getListEmployee(
                        employeeName.isEmpty() ? null : employeeName,
                        departmentId,
                        sortEmployeeName.toLowerCase(),
                        sortCertificationName.toLowerCase(),
                        sortEndDate.toLowerCase(),
                        limit,
                        offset);
            }

            // 3. Tạo dữ liệu response cho API
            EmployeeListResponse response = new EmployeeListResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là []

            return response;
        } catch (Exception e) {
            // 3. Xử lý lỗi 500 (System Error) - Lấy giá trị từ No 1
            return employeeService.buildErrorResponse(Constants.CODE_SYSTEM_ERROR, Constants.CODE_ER023, null);
        }
    }



}
