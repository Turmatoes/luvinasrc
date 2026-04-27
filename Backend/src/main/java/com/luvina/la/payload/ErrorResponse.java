/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * ErrorResponse.java, April 24, 2026 nxplong
 */
package com.luvina.la.payload;

import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO ErrorResponse dùng cho các phản hồi lỗi từ API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String code;
    private Long employeeId;
    private ErrorResponse message;
    private List<String> params;

    public ErrorResponse(String code, List<String> params) {
        this.code = code;
        this.params = params;
    }
}
