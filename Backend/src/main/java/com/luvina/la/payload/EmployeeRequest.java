/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeRequest.java, April 22, 2026 nxplong
 */
package com.luvina.la.payload;

import java.io.Serializable;
import lombok.Data;

/**
 * Request DTO cho việc Thêm mới/Cập nhật nhân viên.
 */
@Data
public class EmployeeRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String employeeLoginId;
    private String employeeName;
    private String employeeNameKana;
    private String employeeBirthDate;
    private String employeeEmail;
    private String employeeTelephone;
    private String employeeLoginPassword;
    private String employeeLoginPasswordConfirm;
    private Long departmentId;

    // Thông tin chứng chỉ (Có thể null nếu không chọn)
    private Long certificationId;
    private String certificationStartDate;
    private String certificationEndDate;
    private String score;
}
