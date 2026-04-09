/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * AuthController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;
import com.luvina.la.service.AuthService;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
/**
 * Lớp AuthController xử lý các yêu cầu liên quan đến xác thực.
 * 
 * @author nxplong
 */
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Phương thức đăng nhập.
     * Xác thực thông tin đăng nhập và trả về access token.
     * 
     * @param loginRequest Thông tin đăng nhập (tên đăng nhập và mật khẩu)
     * @param request Yêu cầu HTTP servlet
     * @return LoginResponse chứa access token hoặc mã lỗi
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        return authService.authenticate(loginRequest);
    }

    /**
     * Phương thức cây lạ xác thực tóken.
     * Kiểm tra xem tóken JWT hiện tại có hợp lệ không.
     * 
     * @return Map chứa thông báo xác thực thành công
     */
    @RequestMapping("/test-auth")
    public Map<String, String> testAuth() {
        Map<String, String> testData = new HashMap<>();
        testData.put("msg", "Token is valid");
        return testData;
    }
}
