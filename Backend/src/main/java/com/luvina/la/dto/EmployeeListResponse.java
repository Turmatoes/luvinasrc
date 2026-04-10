/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeListResponse.java, April 9, 2026 nxplong
 */
package com.luvina.la.dto;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO EmployeeListResponse chứa thông tin danh sách nhân viên.
 * 
 * @author nxplong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private Long totalRecords;
    private List<EmployeeDTO> employees;
}
