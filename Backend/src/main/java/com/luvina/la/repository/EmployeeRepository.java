package com.luvina.la.repository;

import com.luvina.la.entity.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

    Optional<Employee> findByEmployeeLoginId(String employeeLoginId);
    Optional<Employee> findByEmployeeId(Long employeeId);

    // Get total count of non-admin employees (where role = 0 or role IS NULL)
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.role IS NULL OR e.role = 0")
    Long countNonAdminEmployees();

    // Get total count of non-admin employees with filters (where role = 0 or role IS NULL)
    @Query(value = "SELECT COUNT(e.employee_id) " +
            "FROM employees e " +
            "INNER JOIN departments d ON e.department_id = d.department_id " +
            "WHERE (e.role IS NULL OR e.role = 0) " +
            "AND (e.employee_name LIKE CONCAT('%', :employeeName, '%') OR :employeeName = '' OR :employeeName IS NULL) " +
            "AND (e.department_id = :departmentId OR :departmentId IS NULL)",
            nativeQuery = true)
    Long countEmployeesWithFilter(
            @Param("employeeName") String employeeName,
            @Param("departmentId") Long departmentId
    );

    // Get employee list with department and certification info (excluding admins)
    @Query(value = "SELECT " +
            "e.employee_id, " +
            "e.employee_name, " +
            "e.employee_birth_date, " +
            "d.department_name, " +
            "e.employee_email, " +
            "e.employee_telephone, " +
            "c.certification_name, " +
            "ec.end_date, " +
            "ec.score " +
            "FROM employees e " +
            "INNER JOIN departments d ON e.department_id = d.department_id " +
            "LEFT JOIN employees_certifications ec ON e.employee_id = ec.employee_id " +
            "LEFT JOIN certifications c ON ec.certification_id = c.certification_id " +
            "WHERE (e.role IS NULL OR e.role = 0) " +
            "AND (e.employee_name LIKE CONCAT('%', :employeeName, '%') OR :employeeName = '' OR :employeeName IS NULL) " +
            "AND (e.department_id = :departmentId OR :departmentId IS NULL) " +
            "ORDER BY e.employee_id ASC, ec.end_date DESC " +
            "LIMIT :limit OFFSET :offset",
            nativeQuery = true)
    List<Object[]> getEmployeeList(
            @Param("employeeName") String employeeName,
            @Param("departmentId") Long departmentId,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );
}

