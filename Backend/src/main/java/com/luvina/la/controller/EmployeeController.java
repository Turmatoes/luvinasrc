/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

        // Lấy tổng số nhân viên không phải quản trị với bộ lọc
        String normalizedSortEmployeeName = normalizeSort(sortEmployeeName);
        String normalizedSortCertificationName = normalizeSort(sortCertificationName);
        String normalizedSortEndDate = normalizeSort(sortEndDate);

        Long totalRecords = employeeService.countEmployeesWithFilter(
                employeeName.isEmpty() ? null : employeeName,
                departmentId);

        // Lấy danh sách nhân viên với lọc và phân trang
        List<EmployeeDTO> employees = employeeService.getListEmployee(
                employeeName.isEmpty() ? null : employeeName,
                departmentId,
                normalizedSortEmployeeName,
                normalizedSortCertificationName,
                normalizedSortEndDate,
                limit,
                offset);

        // Xây dựng phản hồi
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode("200");
        response.setTotalRecords(totalRecords);
        response.setEmployees(employees);

        return response;
    }

    /**
     * Chuẩn hóa chuỗi sắp xếp.
     * 
     * @param sort Chuỗi sắp xếp (asc hoặc desc)
     * @return Chuỗi đã chuẩn hóa
     */
    private String normalizeSort(String sort) {
        if (sort == null) {
            return "asc";
        }
        String lower = sort.trim().toLowerCase();
        return lower.equals("desc") ? "desc" : "asc";
    }

}
