/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * LoginResponse.java, April 9, 2026 nxplong
 */

package com.luvina.la.payload;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.Data;

/**
 * Đối tượng phạn hồi (Response Payload) cho chức năng đăng nhập.
 * Chứa access token khi đăng nhập thành công hoặc mã lỗi khi thất bại.
 */
@Data
public class LoginResponse {

    /** Token truy cập JWT */
    private String accessToken;
    /** Kiểu token (thương là Bearer) */
    private String tokenType;
    /** Đường danh đẹn các lỗi có từ phía server */
    private List<Object> errors = new ArrayList<>();

    /**
     * Constructor cho phản hồi đăng nhập thành công.
     * 
     * @param accessToken Tóken JWT được tạo
     */
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }

    /**
     * Constructor cho phản hồi đăng nhập thất bại.
     * 
     * @param errorMap Map chứa mã lỗi và thông điệp lỗi
     */
    public LoginResponse(Map<String, String> errorMap) {
        this.errors.add(errorMap);
    }

}
