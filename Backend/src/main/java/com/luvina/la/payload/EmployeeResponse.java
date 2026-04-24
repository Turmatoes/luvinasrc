/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeResponse.java, April 22, 2026 nxplong
 */
package com.luvina.la.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

/**
 * DTO EmployeeResponse dùng cho các phản hồi liên quan đến xử lý nhân viên
 * (Add/Update/Validate).
 * 
 * @author nxplong
 */
@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse extends ErrorResponse {
    private static final long serialVersionUID = 1L;

    public EmployeeResponse() {
        super();
    }

    public EmployeeResponse(String code, List<String> params) {
        super(code, params);
    }
}
