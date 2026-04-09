package com.luvina.la.controller;

import com.luvina.la.payload.EmployeeListDTO;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.repository.EmployeeListProjection;
import com.luvina.la.repository.EmployeeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
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
        Long totalRecords = employeeRepository.countNonAdminEmployees();
        
        // Get employee list with pagination
        List<EmployeeListProjection> projections = employeeRepository.getEmployeeList(
                employeeName.isEmpty() ? null : employeeName,
                departmentId,
                limit,
                offset
        );
        
        // Convert projections to DTO
        List<EmployeeListDTO> employees = projections.stream()
                .map(p -> new EmployeeListDTO(
                        p.getEmployeeId(),
                        p.getEmployeeName(),
                        p.getEmployeeBirthDate(),
                        p.getDepartmentName(),
                        p.getEmployeeEmail(),
                        p.getEmployeeTelephone(),
                        p.getCertificationName(),
                        p.getEndDate(),
                        p.getScore()
                ))
                .collect(Collectors.toList());
        
        // Build response
        EmployeeListResponse response = new EmployeeListResponse();
        response.setCode(200);
        response.setTotalRecords(totalRecords);
        response.setEmployees(employees);
        
        return response;
    }
}
