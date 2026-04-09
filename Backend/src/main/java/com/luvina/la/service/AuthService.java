/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * AuthService.java, April 9, 2026 nxplong
 */

package com.luvina.la.service;

import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;

/**
 * Gào diền (Interface) dịch vụ xác thực và quản lý phép cấp.
 * Định nghĩa các phương thức xử lý đăng nhập và tạo tóken.
 */
public interface AuthService {

    /**
     * Xác thực người dùng với thông tin xác thực và tạo tóken JWT.
     * 
     * @param loginRequest Thông tin đăng nhập (tên dũng và mật khẩu)
     * @return LoginResponse chứa access token hoặc mã lỗi
     */
    LoginResponse authenticate(LoginRequest loginRequest);
}
