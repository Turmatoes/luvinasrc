/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.BaseResponse;
import com.luvina.la.payload.AddResponse;
import com.luvina.la.payload.EditResponse;
import com.luvina.la.payload.DeleteResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validate.EmployeeValidate;
import com.luvina.la.payload.EmployeeDetailResponse;
import com.luvina.la.payload.EmployeeRequest;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    public BaseResponse getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "sortEmployeeName", required = false, defaultValue = "asc") String sortEmployeeName,
            @RequestParam(value = "sortCertificationName", required = false, defaultValue = "asc") String sortCertificationName,
            @RequestParam(value = "sortEndDate", required = false, defaultValue = "asc") String sortEndDate,
            @RequestParam(value = "limit", required = false, defaultValue = "20") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {

        try {
            String normalizedEmployeeName = employeeName == null ? "" : employeeName.trim();

            // Validate parameter
            BaseResponse employeeResponse = employeeValidate.validateListParams(
                    sortEmployeeName, sortCertificationName, sortEndDate, offset, limit, normalizedEmployeeName);
            if (employeeResponse != null) {
                return employeeResponse;
            }

            String escapedEmployeeName = employeeService.escapeEmployeeName(normalizedEmployeeName);

            // Lấy tổng số nhân viên từ DB
            Long totalRecords = employeeService.countEmployeesWithFilter(
                    escapedEmployeeName,
                    departmentId);

            // Nếu không có bản ghi nào, trả về response rỗng
            if (totalRecords == 0) {
                EmployeeListResponse emptyResponse = new EmployeeListResponse();
                emptyResponse.setCode(Constants.CODE_SUCCESS);
                emptyResponse.setTotalRecords(0L);
                emptyResponse.setEmployees(new ArrayList<>());
                return emptyResponse;
            }

            // Lấy danh sách nhân viên thực tế theo phân trang
            List<EmployeeDTO> employees = employeeService.getListEmployee(
                    escapedEmployeeName,
                    departmentId,
                    sortEmployeeName,
                    sortCertificationName,
                    sortEndDate,
                    limit,
                    offset);

            // Tạo dữ liệu response thành công
            EmployeeListResponse response = new EmployeeListResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setTotalRecords(totalRecords);
            response.setEmployees(employees);
            response.setParams(new ArrayList<>()); // Đảm bảo params luôn là []

            return response;

        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return BaseResponse.build(Constants.CODE_ER023);
        }
    }

    /**
     * Lấy chi tiết một nhân viên hiển thị lên màn adm003
     * 
     * @param id ID của nhân viên
     * @return EmployeeDetailResponse chứa thông tin nhân viên hoặc mã lỗi
     */
    @GetMapping("/employees/{id}")
    public BaseResponse getEmployeeDetail(@PathVariable("id") Long id) {
        try {
            EmployeeDTO employee = employeeService.getEmployeeById(id);
            if (employee == null) {
                // Không tìm thấy nhân viên (Mã lỗi ER013)
                return BaseResponse.build(Constants.CODE_ER013);
            }

            // Tạo dữ liệu response thành công
            EmployeeDetailResponse response = new EmployeeDetailResponse();
            response.setCode(Constants.CODE_SUCCESS);
            response.setEmployeeDTO(employee);
            return response;

        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return BaseResponse.build(Constants.CODE_ER023);
        }
    }

    /**
     * API Validate dữ liệu nhân viên trước khi xác nhận (nút 確認 tại màn adm004)
     * 
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return BaseResponse chứa thông tin kết quả validate
     */
    @PostMapping("/employees/validate")
    public BaseResponse validateEmployee(@RequestBody EmployeeRequest request) {
        try {
            return employeeValidate.validateExistenceOnly(request);
        } catch (Exception e) {
            // Lỗi hệ thống (Mã lỗi ER023)
            return BaseResponse.build(Constants.CODE_ER023);
        }
    }

    /**
     * Thêm mới nhân viên.
     * 
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return AddResponse chứa kết quả thêm mới
     */
    @PostMapping("/employees")
    public AddResponse addEmployee(@RequestBody EmployeeRequest request) {
        // Thực hiện lại validate trước khi lưu vào DB thông qua lớp EmployeeValidate
        BaseResponse validateRes = employeeValidate.validateEmployee(request);
        if (validateRes != null && !Constants.CODE_SUCCESS.equals(validateRes.getCode())) {
            return AddResponse.error(validateRes.getCode(), validateRes.getParams());
        }
        return employeeService.addEmployee(request);
    }

    /**
     * Cập nhật thông tin nhân viên.
     * 
     * @param id      ID của nhân viên
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return EditResponse chứa kết quả cập nhật
     */
    @PutMapping("/employees/{id}")
    public EditResponse updateEmployee(@PathVariable("id") Long id, @RequestBody EmployeeRequest request) {
        request.setEmployeeId(id);
        // Thực hiện lại validate trước khi lưu vào DB thông qua lớp EmployeeValidate
        BaseResponse validateRes = employeeValidate.validateEmployee(request);
        if (validateRes != null && !Constants.CODE_SUCCESS.equals(validateRes.getCode())) {
            return EditResponse.error(validateRes.getCode(), validateRes.getParams());
        }
        return employeeService.updateEmployee(request);
    }

    /**
     * Xóa thông tin nhân viên.
     * 
     * @param id ID của nhân viên
     * @return DeleteResponse chứa kết quả xóa
     */
    @DeleteMapping("/employees/{id}")
    public DeleteResponse deleteEmployee(@PathVariable("id") Long id) {
        return employeeService.deleteEmployee(id);
    }
}
