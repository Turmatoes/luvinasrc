/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeDTO.java, April 9, 2026 nxplong
 */

package com.luvina.la.dto;

import java.io.Serializable;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Đối tượng truyền dữ liệu (Data Transfer Object) cho thông tin nhân viên.
 * Được sử dụng cho cả chi tiết nhân viên và mục danh sách nhân viên.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 6868189362900231672L;

    // Individual employee fields (full detail)
    private Long employeeId;
    private Long departmentId;
    private String departmentName;
    private String employeeName;
    private String employeeNameKana;
    private LocalDate employeeBirthDate;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeLoginId;
    private String employeeLoginPassword;

    // Employee list fields (certification info)
    private String certificationName;
    private LocalDate endDate;
    private Double score;

    /**
     * Constructor for employee list items (without login credentials)
     */
    public EmployeeDTO(Long employeeId, String employeeName, LocalDate employeeBirthDate,
            String departmentName, String employeeEmail, String employeeTelephone,
            String certificationName, LocalDate endDate, Double score) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeBirthDate = employeeBirthDate;
        this.departmentName = departmentName;
        this.employeeEmail = employeeEmail;
        this.employeeTelephone = employeeTelephone;
        this.certificationName = certificationName;
        this.endDate = endDate;
        this.score = score;
    }
}
