package com.luvina.la.service;

import com.luvina.la.dto.EmployeeDTO;
import java.util.List;

/**
 * Service interface for employee-related business logic
 */
public interface EmployeeService {

    /**
     * Get employee list with filtering and pagination
     * Excludes admin users (role = 1)
     *
     * @param employeeName Filter by employee name (optional)
     * @param departmentId Filter by department id (optional)
     * @param limit Number of records per page
     * @param offset Page offset
     * @return List of employee DTOs
     */
    List<EmployeeDTO> getEmployeeList(String employeeName, Long departmentId, Integer limit, Integer offset);

    /**
     * Count total number of non-admin employees
     *
     * @return Total count of employees where role = 0 or role IS NULL
     */
    Long countNonAdminEmployees();
}
