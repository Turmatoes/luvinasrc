/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeServiceImpl.java, April 9, 2026 nxplong
 */

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
 * Thực hiện dịch vụ nhân viên (EmployeeService).
 * Xử lý logic kinh doanh cho các thao tác nhân viên.
 * 
 * @author nxplong
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    /**
     * Constructor khởi tạo EmployeeServiceImpl.
     *
     * @param employeeRepository Repository xử lý dự liệu nhân viên
     */
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Chuyển đổi dự liệu Object[] từ repository thành DTO.
     * 
     * @param employeeName Tên nhân viên lôc (không bắt buộc)
     * @param departmentId Mã phòng ban lôc (không bắt buộc)
     * @param limit Số bản ghi trên trang
     * @param offset Số trang
     * @return Danh sách EmployeeDTO
     */
    @Override
    public List<EmployeeDTO> getEmployeeList(String employeeName, Long departmentId, Integer limit, Integer offset) {
        // Lấy dự liệu thô từ repository dưới dạng Object[]
        List<Object[]> rows = employeeRepository.getEmployeeList(
                employeeName,
                departmentId,
                limit,
                offset
        );

        // Chuyển đổi Object[] thành EmployeeDTO sử dụng constructor tiện lợi
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
     * Đếm tổng số nhân viên không phải quản trị.
     * 
     * @return Tổng số nhân viên có role = 0 hoặc role IS NULL
     */
    @Override
    public Long countNonAdminEmployees() {
        return employeeRepository.countNonAdminEmployees();
    }

    /**
     * Chuyển đổi java.sql.Date sang java.time.LocalDate.
     * Xử lý giá trị null và các kiểu dự liệu ngày khác nhau.
     * 
     * @param obj Object có thể là java.sql.Date
     * @return LocalDate được chuyển đổi từ đầu vào, hoặc null nếu đầu vào là null
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
