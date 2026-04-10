/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeRepository.java, April 9, 2026 nxplong
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Interface EmployeeRepository chứa thông tin nhân viên.
 * 
 * @author nxplong
 */
@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Long> {

        Optional<Employee> findByEmployeeLoginId(String employeeLoginId);

        Optional<Employee> findByEmployeeId(Long employeeId);

        // Lấy tổng số nhân viên (where role = 0 or role IS NULL)
        @Query("SELECT COUNT(e) FROM Employee e WHERE e.role IS NULL OR e.role = 0")
        Long countNonAdminEmployees();

        // Lấy tổng số nhân viên (where role = 0 or role IS NULL)
        @Query(value = "SELECT COUNT(e.employee_id) " +
                        "FROM employees e " +
                        "INNER JOIN departments d ON e.department_id = d.department_id " +
                        "WHERE (e.role IS NULL OR e.role = 0) " +
                        "AND (:employeeName IS NULL OR :employeeName = '' OR e.employee_name LIKE CONCAT('%', :employeeName, '%')) "
                        +
                        "AND (:departmentId IS NULL OR e.department_id = :departmentId)", nativeQuery = true)
        Long countEmployeesWithFilter(
                        @Param("employeeName") String employeeName,
                        @Param("departmentId") Long departmentId);

        // Lấy danh sách nhân viên (where role = 0 or role IS NULL)
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
                        "AND (:employeeName IS NULL OR :employeeName = '' OR e.employee_name LIKE CONCAT('%', :employeeName, '%')) "
                        +
                        "AND (:departmentId IS NULL OR e.department_id = :departmentId) " +
                        "ORDER BY " +
                        // Priority 1: employee_name
                        "CASE WHEN :sortEmployeeName = 'asc' THEN e.employee_name END ASC, " +
                        "CASE WHEN :sortEmployeeName = 'desc' THEN e.employee_name END DESC, " +
                        // Priority 2: Japanese skill = certification_level (smaller is higher). Nulls always last.
                        "(c.certification_level IS NULL) ASC, " +
                        "CASE WHEN :sortCertificationName = 'desc' THEN c.certification_level END ASC, " +
                        "CASE WHEN :sortCertificationName = 'asc' THEN c.certification_level END DESC, " +
                        // Priority 3: end_date. Nulls always last.
                        "(ec.end_date IS NULL) ASC, " +
                        "CASE WHEN :sortEndDate = 'asc' THEN ec.end_date END ASC, " +
                        "CASE WHEN :sortEndDate = 'desc' THEN ec.end_date END DESC, " +
                        "e.employee_id ASC " +
                        "LIMIT :limit OFFSET :offset", nativeQuery = true)
        List<Object[]> getEmployeeList(
                        @Param("employeeName") String employeeName,
                        @Param("departmentId") Long departmentId,
                        @Param("sortEmployeeName") String sortEmployeeName,
                        @Param("sortCertificationName") String sortCertificationName,
                        @Param("sortEndDate") String sortEndDate,
                        @Param("limit") Integer limit,
                        @Param("offset") Integer offset);
}
