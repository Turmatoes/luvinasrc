/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * BaseResponse.java, May 10, 2026 nxplong
 */
package com.luvina.la.payload;

import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cơ sở cho các phản hồi từ API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String code;
    private Long employeeId;
    private BaseResponse message;
    private List<String> params;

    /**
     * Constructor với code và params (format phẳng).
     *
     * @param code   Mã lỗi/thông báo
     * @param params Danh sách tham số
     */
    public BaseResponse(String code, List<String> params) {
        this.code = code;
        this.params = params != null ? params : new java.util.ArrayList<>();
    }

    /**
     * Build response format phẳng chỉ có code.
     *
     * @param code Mã lỗi/thông báo
     * @return BaseResponse
     */
    public static BaseResponse build(String code) {
        return new BaseResponse(code, null);
    }

    /**
     * Build response format phẳng với code và params.
     *
     * @param code   Mã lỗi/thông báo
     * @param params Danh sách tham số
     * @return BaseResponse
     */
    public static BaseResponse build(String code, List<String> params) {
        return new BaseResponse(code, params);
    }

    /**
     * Build response format lồng nhau {code, employeeId, message: {code, params}}
     *
     * @param code       Mã định danh (OK/Internal Server Error)
     * @param employeeId ID nhân viên
     * @param msgCode    Mã lỗi/thông báo chi tiết
     * @param params     Danh sách tham số
     * @return BaseResponse
     */
    public static BaseResponse build(String code, Long employeeId, String msgCode, List<String> params) {
        BaseResponse response = new BaseResponse();
        response.setCode(code);
        response.setEmployeeId(employeeId);

        BaseResponse message = new BaseResponse();
        message.setCode(msgCode);
        message.setParams(params != null ? params : new java.util.ArrayList<>());

        response.setMessage(message);
        return response;
    }
}
