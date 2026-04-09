package com.luvina.la.payload;

import java.io.Serializable;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for employee list response
 * Used for GET /api/employees endpoint
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeListDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long employeeId;
    private String employeeName;
    private LocalDate employeeBirthDate;
    private String departmentName;
    private String employeeEmail;
    private String employeeTelephone;
    private String certificationName;
    private LocalDate endDate;
    private Double score;
}
