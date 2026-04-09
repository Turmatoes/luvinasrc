/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * LoginRequest.java, April 9, 2026 nxplong
 */

package com.luvina.la.payload;

import lombok.Data;

/**
 * Đối tượng yêu cầu (Request Payload) cho chức năng đăng nhập.
 * Chứa thông tin xác thực của người dùng.
 */
@Data
public class LoginRequest {

    /** Tên dũng hoặc email đăng nhập */
    private String username;
    /** Mật khẩu đăng nhập */
    private String password;
}
