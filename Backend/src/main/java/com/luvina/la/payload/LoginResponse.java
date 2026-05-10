/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * LoginResponse.java, April 9, 2026 nxplong
 */

package com.luvina.la.payload;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Đối tượng phản hồi (Response Payload) cho chức năng đăng nhập.
 * Chứa access token khi đăng nhập thành công hoặc mã lỗi khi thất bại.
 * Format lỗi chuẩn: {code: "", params: []}
 */
@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse extends BaseResponse {

    /** Token truy cập JWT */
    private String accessToken;
    /** Kiểu token (thường là Bearer) */
    private String tokenType;

    /**
     * Constructor cho phản hồi đăng nhập thành công.
     * 
     * @param accessToken Token JWT được tạo
     */
    public LoginResponse(String accessToken) {
        super();
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }

    /**
     * Constructor cho phản hồi đăng nhập thất bại.
     * Format chuẩn: {code: "ERxxx", params: [...]}
     * 
     * @param code   Mã lỗi
     * @param params Danh sách tham số
     */
    public LoginResponse(String code, List<String> params) {
        super(code, params);
    }

}
