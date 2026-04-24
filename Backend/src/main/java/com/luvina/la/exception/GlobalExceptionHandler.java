/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * GlobalExceptionHandler.java, April 13, 2026 nxplong
 */
package com.luvina.la.exception;

import com.luvina.la.payload.ErrorResponse;
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
    public ResponseEntity<ErrorResponse> handleSystemError(Exception ex) {
        ErrorResponse response = employeeService.buildResponse(Constants.CODE_ER023);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
