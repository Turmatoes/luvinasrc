/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api")
/**
 * Lớp EmployeeController xử lý các yêu cầu liên quản đến danh sách nhân viên.
 * 
 * @author nxplong
 */
public class EmployeeController {

    private final EmployeeService employeeService;
    private final MessageSource messageSource;

    // Các mã định danh phản hồi chuẩn
    private static final String CODE_SUCCESS = String.valueOf(HttpStatus.OK.value());
    private static final String CODE_SYSTEM_ERROR = String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value());
    private static final String CODE_ER021 = "ER021";
    private static final String CODE_ER022 = "ER022";
    private static final String CODE_ER023 = "ER023";

    /**
     * Constructor khởi tạo EmployeeController.
     *
     * @param employeeService Dịch vụ xử lý nhân viên
     * @param messageSource   Nguồn thông báo đa ngôn ngữ
     */
    public EmployeeController(EmployeeService employeeService, MessageSource messageSource) {
        this.employeeService = employeeService;
        this.messageSource = messageSource;
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
            if (!isValidSort(sortEmployeeName) || !isValidSort(sortCertificationName) || !isValidSort(sortEndDate)) {
                return buildErrorResponse(CODE_ER021);
            }

            // 2.1 Lấy tổng số nhân viên
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    employeeName.isEmpty() ? null : employeeName,
                    departmentId);

            List<EmployeeDTO> employees = new ArrayList<>();

            if (totalRecords > 0) {
                // Kiểm tra tính hợp lệ của Offset (ER022)
                if (offset >= totalRecords) {
                    return buildErrorResponse(CODE_ER022);
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
            response.setCode(CODE_SUCCESS);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là []

            return response;
        } catch (Exception e) {
            // 3. Xử lý lỗi 500 (System Error) - Lấy giá trị từ No 1
            return buildErrorResponse(CODE_SYSTEM_ERROR, CODE_ER023);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của tham số sắp xếp.
     * 
     * @param sort Giá trị sắp xếp
     * @return true nếu hợp lệ (asc hoặc desc), ngược lại false
     */
    private boolean isValidSort(String sort) {
        if (sort == null || sort.isEmpty())
            return true;
        String val = sort.trim().toLowerCase();
        return "asc".equals(val) || "desc".equals(val);
    }

    /**
     * Xây dựng đối tượng phản hồi lỗi.
     * 
     * @param errorCode Mã lỗi
     * @return EmployeeListResponse chứa mã lỗi và thông báo tương ứng
     */
    private EmployeeListResponse buildErrorResponse(String errorCode) {
        return buildErrorResponse(errorCode, errorCode);
    }

    /**
     * Xây dựng đối tượng phản hồi lỗi với mã và thông báo tùy chỉnh.
     * 
     * @param code        Mã phản hồi (vd: 500)
     * @param messageCode Mã lỗi để lấy thông báo từ MessageSource
     * @return EmployeeListResponse
     */
    private EmployeeListResponse buildErrorResponse(String code, String messageCode) {
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode(code);
        response.setMessage(messageSource.getMessage(messageCode, null, Locale.JAPANESE));
        response.setParams(new ArrayList<>()); // Format {code: "", params: []}
        return response;
    }

}
