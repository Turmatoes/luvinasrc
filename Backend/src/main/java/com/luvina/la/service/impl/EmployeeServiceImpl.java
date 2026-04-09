package com.luvina.la.service.impl;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Implementation of employee service
 * Handles business logic for employee operations
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get employee list with filtering and pagination
     * Converts repository Object[] to DTOs
     *
     * @param employeeName Filter by employee name (optional)
     * @param departmentId Filter by department id (optional)
     * @param limit Number of records per page
     * @param offset Page offset
     * @return List of employee DTOs
     */
    @Override
    public List<EmployeeDTO> getEmployeeList(String employeeName, Long departmentId, Integer limit, Integer offset) {
        // Fetch raw data from repository as Object[]
        List<Object[]> rows = employeeRepository.getEmployeeList(
                employeeName,
                departmentId,
                limit,
                offset
        );

        // Convert Object[] rows to EmployeeDTO using convenience constructor
        return rows.stream()
                .map(row -> new EmployeeDTO(
                        ((Number) row[0]).longValue(),         // employeeId
                        (String) row[1],                        // employeeName
                        convertSqlDateToLocalDate(row[2]),      // employeeBirthDate
                        (String) row[3],                        // departmentName
                        (String) row[4],                        // employeeEmail
                        (String) row[5],                        // employeeTelephone
                        (String) row[6],                        // certificationName
                        convertSqlDateToLocalDate(row[7]),      // endDate
                        row[8] != null ? ((Number) row[8]).doubleValue() : null  // score
                ))
                .collect(Collectors.toList());
    }

    /**
     * Count total number of non-admin employees
     *
     * @return Total count of employees where role = 0 or role IS NULL
     */
    @Override
    public Long countNonAdminEmployees() {
        return employeeRepository.countNonAdminEmployees();
    }

    /**
     * Convert java.sql.Date to java.time.LocalDate
     * Handles null values and different date type inputs
     *
     * @param obj Object that may be a java.sql.Date
     * @return LocalDate converted from input, or null if input is null
     */
    private LocalDate convertSqlDateToLocalDate(Object obj) {
        if (obj == null) {
            return null;
        }
        if (obj instanceof Date) {
            return ((Date) obj).toLocalDate();
        }
        if (obj instanceof LocalDate) {
            return (LocalDate) obj;
        }
        return null;
    }
}
