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
import java.util.Arrays;
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
     * @param employeeService    Dịch vụ xử lý nhân viên
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
    public EmployeeListResponse getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = "asc") String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = "desc") String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = "asc") String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        try {
            // 1.1 Validate param [ord_employee_name],
            // [ord_certification_name],[ord_end_date]
            if (!employeeValidation.isValidSort(sortEmployeeName)
                    || !employeeValidation.isValidSort(sortCertificationName)
                    || !employeeValidation.isValidSort(sortEndDate)) {
                return employeeService.buildErrorResponse(Constants.CODE_ER021);
            }

            // 1.2 Validate param [offset]
            if (!employeeValidation.isPositiveInteger(offset)) {
                return employeeService.buildErrorResponse(Constants.CODE_ER018, Constants.CODE_ER018,
                        Arrays.asList("オフセット"));
            }

            // 1.3 Validate param [limit]
            if (!employeeValidation.isPositiveInteger(limit)) {
                return employeeService.buildErrorResponse(Constants.CODE_ER018, Constants.CODE_ER018,
                        Arrays.asList("リミット"));
            }

            // 2.1 Lấy tổng số nhân viên
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    employeeName.isEmpty() ? null : employeeName,
                    departmentId);

            List<EmployeeDTO> employees = new ArrayList<>();

            if (totalRecords > 0) {
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

            // 3. Tạo dữ liệu response thành công cho API
            return employeeService.buildSuccessResponse(totalRecords, employees);
        } catch (Exception e) {
            // 3. Xử lý lỗi 500 (System Error) - Lấy giá trị từ No 1
            return employeeService.buildErrorResponse(Constants.CODE_SYSTEM_ERROR, Constants.CODE_ER023, null);
        }
    }

}
