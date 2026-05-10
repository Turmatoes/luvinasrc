/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeListResponse.java, April 9, 2026 nxplong
 */
package com.luvina.la.payload;

import java.util.List;
import com.luvina.la.dto.EmployeeDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.EqualsAndHashCode;

/**
 * DTO EmployeeListResponse chứa thông tin danh sách nhân viên.
 * 
 * @author nxplong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeListResponse extends BaseResponse {
    private static final long serialVersionUID = 1L;

    private Long totalRecords;
    private List<EmployeeDTO> employees;
}
