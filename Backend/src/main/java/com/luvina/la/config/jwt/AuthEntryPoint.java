/**
 * Package: com.luvina.la.config.jwt
 * Description: Package chứa các cấu hình liên quan đến JWT (JSON Web Token)
 * bao gồm: AuthEntryPoint, JwtAuthenticationFilter, JwtUtils, WebSecurityConfig
 */

package com.luvina.la.config.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Lớp AuthEntryPoint xử lý các lỗi xác thực (AuthenticationException).
 * Khi có lỗi xác thực xảy ra (ví dụ: token không hợp lệ, không có token),
 * lớp này sẽ gửi trả lỗi 401 Unauthorized.
 */
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        log.error("Unauthorized error: {}", authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }
}
