/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * GlobalExceptionHandler.java, April 13, 2026 Ame
 */
package com.luvina.la.controller;

import com.luvina.la.payload.EmployeeListResponse;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Lớp GlobalExceptionHandler xử lý các ngoại lệ tập trung cho toàn bộ ứng dụng.
 * Trả về phản hồi lỗi theo định dạng chuẩn đã quy định.
 * 
 * @author Ame
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    /**
     * Constructor khởi tạo GlobalExceptionHandler.
     * 
     * @param messageSource Nguồn thông báo đa ngôn ngữ
     */
    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Xử lý lỗi hệ thống chung (ER023).
     * 
     * @param ex Ngoại lệ xảy ra
     * @return ResponseEntity chứa thông tin lỗi ER023
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<EmployeeListResponse> handleSystemError(Exception ex) {
        // Lấy thông báo lỗi từ messages.properties (mặc định là Tiếng Nhật theo cấu hình)
        String message = messageSource.getMessage("ER023", null, LocaleContextHolder.getLocale());
        
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode("ER023");
        response.setMessage(message);
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Xử lý các lỗi RuntimeException khác nếu cần cụ thể hóa.
     * Hiện tại được gộp chung vào xử lý Exception nhưng có thể mở rộng tại đây.
     */
}
