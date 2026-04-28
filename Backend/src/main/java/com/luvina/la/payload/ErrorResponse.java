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
 * 
 * @author nxplong
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

    /**
     * Constructor với code và params (format phẳng).
     *
     * @param code   Mã lỗi
     * @param params Danh sách tham số lỗi
     * @return ErrorResponse chứa mã lỗi
     */
    public ErrorResponse(String code, List<String> params) {
        this.code = code;
        this.params = params != null ? params : new java.util.ArrayList<>();
    }

    /**
     * Build response format phẳng {code, params}.
     *
     * @param errorCode Mã lỗi
     * @param params    Danh sách tham số lỗi
     * @return ErrorResponse chứa mã lỗi
     */
    public static ErrorResponse build(String errorCode, List<String> params) {
        return new ErrorResponse(errorCode, params);
    }

    /**
     * Build response format phẳng chỉ có code.
     *
     * @param errorCode Mã lỗi
     * @return ErrorResponse chứa mã lỗi
     */
    public static ErrorResponse build(String errorCode) {
        return build(errorCode, null);
    }

    /**
     * Build response format lồng nhau {code, employeeId, message: {code, params}}
     * Thường dùng cho các phản hồi Delete/Update thành công hoặc lỗi.
     *
     * @param code       Mã lỗi
     * @param employeeId ID nhân viên
     * @param msgCode    Mã lỗi thông báo
     * @param params     Danh sách tham số lỗi
     * @return ErrorResponse chứa mã lỗi
     */
    public static ErrorResponse build(String code, Long employeeId, String msgCode, List<String> params) {
        ErrorResponse response = new ErrorResponse();
        response.setCode(code);
        response.setEmployeeId(employeeId);

        ErrorResponse message = new ErrorResponse();
        message.setCode(msgCode);
        message.setParams(params != null ? params : new java.util.ArrayList<>());

        response.setMessage(message);
        return response;
    }
}
