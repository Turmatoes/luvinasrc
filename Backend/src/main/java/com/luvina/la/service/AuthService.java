package com.luvina.la.service;

import com.luvina.la.payload.LoginRequest;
import com.luvina.la.payload.LoginResponse;

/**
 * Service interface for authentication and authorization
 */
public interface AuthService {

    /**
     * Authenticate user with credentials and generate JWT token
     *
     * @param loginRequest Login credentials (username and password)
     * @return LoginResponse with accessToken or error codes
     */
    LoginResponse authenticate(LoginRequest loginRequest);
}
