/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * GlobalExceptionHandler.java, April 13, 2026 nxplong
 */
package com.luvina.la.controller;

import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.config.Constants;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Lớp GlobalExceptionHandler xử lý các ngoại lệ tập trung cho toàn bộ ứng dụng.
 * Trả về phản hồi lỗi theo định dạng chuẩn đã quy định.
 * 
 * @author nxplong
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final EmployeeService employeeService;

    /**
     * Constructor khởi tạo GlobalExceptionHandler.
     * 
     * @param employeeService Dịch vụ nhân viên dùng để tạo response lỗi
     */
    public GlobalExceptionHandler(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * Xử lý lỗi hệ thống chung (ER023).
     * 
     * @param ex Ngoại lệ xảy ra
     * @return ResponseEntity chứa thông tin lỗi ER023
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<EmployeeListResponse> handleSystemError(Exception ex) {
        EmployeeListResponse response = employeeService.buildErrorResponse(Constants.CODE_SYSTEM_ERROR, Constants.CODE_ER023, null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Xử lý các lỗi RuntimeException khác nếu cần cụ thể hóa.
     * Hiện tại được gộp chung vào xử lý Exception nhưng có thể mở rộng tại đây.
     */
}
