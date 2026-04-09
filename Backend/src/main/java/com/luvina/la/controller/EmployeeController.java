package com.luvina.la.controller;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.dto.EmployeeListResponse;
import com.luvina.la.service.EmployeeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * Get employee list with filtering and pagination
     * Excludes admin users (role = 1)
     * 
     * @param employeeName Filter by employee name (optional)
     * @param departmentId Filter by department id (optional)
     * @param limit Number of records per page (default: 5)
     * @param offset Page offset (default: 0)
     * @return EmployeeListResponse with total records and employee list
     */
    @GetMapping("/employees")
    public EmployeeListResponse getEmployeeList(
            @RequestParam(value = "employeeName", required = false, defaultValue = "") String employeeName,
            @RequestParam(value = "departmentId", required = false) Long departmentId,
            @RequestParam(value = "limit", required = false, defaultValue = "5") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {
        
        // Get total count of non-admin employees
        Long totalRecords = employeeService.countNonAdminEmployees();
        
        // Get employee list with pagination and filtering
        List<EmployeeDTO> employees = employeeService.getEmployeeList(
                employeeName.isEmpty() ? null : employeeName,
                departmentId,
                limit,
                offset
        );
        
        // Build response
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode(200);
        response.setTotalRecords(totalRecords);
        response.setEmployees(employees);
        
        return response;
    }
}
