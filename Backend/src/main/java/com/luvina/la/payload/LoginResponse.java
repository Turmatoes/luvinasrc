package com.luvina.la.payload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private List<Object> errors = new ArrayList<>();

    /** Success response */
    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }

    /** Error response */
    public LoginResponse(Map<String, String> errorMap) {
        this.errors.add(errorMap);
    }

}
