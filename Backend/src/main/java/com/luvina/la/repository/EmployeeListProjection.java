package com.luvina.la.repository;

import java.time.LocalDate;

/**
 * Interface projection for employee list query
 */
public interface EmployeeListProjection {
    Long getEmployeeId();
    String getEmployeeName();
    LocalDate getEmployeeBirthDate();
    String getDepartmentName();
    String getEmployeeEmail();
    String getEmployeeTelephone();
    String getCertificationName();
    LocalDate getEndDate();
    Double getScore();
}
