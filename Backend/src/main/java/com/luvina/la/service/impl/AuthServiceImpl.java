/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * AuthServiceImpl.java, April 9, 2026 nxplong
 */

package com.luvina.la.service.impl;

import com.luvina.la.config.jwt.AuthUserDetails;
import com.luvina.la.config.jwt.JwtTokenProvider;
import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;
import com.luvina.la.service.AuthService;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Thực hiện dịch vụ xác thực (AuthService).
 * Xử lý đăng nhập người dùng và tạo token JWT.
 * 
 * @author nxplong
 */
@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Constructor khởi tạo AuthServiceImpl.
     *
     * @param authenticationManager Quản lý xác thực Spring Security
     * @param jwtTokenProvider      Nhà cung cấp token JWT
     */
    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Xác thực người dùng với thông tin xác thực và tạo token JWT.
     * 
     * @param loginRequest Thông tin đăng nhập (tên dũng và mật khẩu)
     * @return LoginResponse chứa access token hoặc mã lỗi
     */
    @Override
    public LoginResponse authenticate(LoginRequest loginRequest) {
        Map<String, String> errors = new HashMap<>();
        try {
            log.info("Login attempt for user: {}", loginRequest.getUsername());

            // Xác thực thông tin đăng nhập
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            // Đặt xác thực trong ngữ cảnh bảo mật
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Tạo token JWT
            String accessToken = jwtTokenProvider.generateToken((AuthUserDetails) authentication.getPrincipal());
            log.info("Login successful for user: {}, token: {}", loginRequest.getUsername(),
                    accessToken.substring(0, 20) + "...");
            return new LoginResponse(accessToken);

        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            // Ghi nhật ký sai thông tin xác thực
            log.warn("Login failed for user: {} - {}", loginRequest.getUsername(), ex.getMessage());
            errors.put("code", "ER016");
        } catch (Exception ex) {
            // Ghi nhật ký lỗi không xác định
            log.warn("Login failed for user: {} - {}", loginRequest.getUsername(), ex.getMessage());
            ex.printStackTrace();
            errors.put("code", "ER023");
        }
        return new LoginResponse(errors);
    }
}
