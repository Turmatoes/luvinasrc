/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeResponse.java, April 22, 2026 nxplong
 */
package com.luvina.la.payload;

import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO EmployeeResponse dùng cho các phản hồi liên quan đến xử lý nhân viên (Add/Update/Validate).
 * 
 * @author nxplong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String code;
    private List<String> params;
}
