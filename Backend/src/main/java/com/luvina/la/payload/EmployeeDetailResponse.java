/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeDetailResponse.java, April 24, 2026 nxplong
 */
package com.luvina.la.payload;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luvina.la.dto.EmployeeDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO EmployeeDetailResponse chứa thông tin chi tiết nhân viên.
 * 
 * @author nxplong
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDetailResponse extends BaseResponse {
    private static final long serialVersionUID = 1L;

    private EmployeeDTO employeeDTO;
}
