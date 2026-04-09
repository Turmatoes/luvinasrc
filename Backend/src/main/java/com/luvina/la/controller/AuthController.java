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
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Login api
     *
     * @param loginRequest Login credentials
     * @param request HTTP servlet request
     * @return LoginResponse with accessToken or error codes
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        return authService.authenticate(loginRequest);
    }

    /**
     * Test token API
     *
     * @return Test response
     */
    @RequestMapping("/test-auth")
    public Map<String, String> testAuth() {
        Map<String, String> testData = new HashMap<>();
        testData.put("msg", "Token is valid");
        return testData;
    }
}
