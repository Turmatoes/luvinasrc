/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeServiceImpl.java, April 9, 2026 nxplong
 */

package com.luvina.la.service.impl;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.config.Constants;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.MessageSource;
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
    private final MessageSource messageSource;

    /**
     * Constructor khởi tạo EmployeeServiceImpl.
     *
     * @param employeeRepository Repository xử lý dự liệu nhân viên
     * @param messageSource      Tài nguyên message
     */
    public EmployeeServiceImpl(EmployeeRepository employeeRepository, MessageSource messageSource) {
        this.employeeRepository = employeeRepository;
        this.messageSource = messageSource;
    }

    /**
     * Lấy danh sách nhân viên với lọc và phân trang.
     * Chuyển đổi dự liệu Object[] từ repository thành DTO.
     * 
     * @param employeeName Tên nhân viên
     * @param departmentId Mã phòng ban
     * @param limit        Số bản ghi trên trang
     * @param offset       Số trang
     * @return Danh sách EmployeeDTO
     */
    @Override
    public List<EmployeeDTO> getListEmployee(String employeeName, Long departmentId, String sortEmployeeName,
            String sortCertificationName, String sortEndDate, Integer limit, Integer offset) {
        // Lấy dự liệu thô từ repository dưới dạng Object[]
        List<Object[]> rows = employeeRepository.getListEmployee(
                employeeName,
                departmentId,
                sortEmployeeName,
                sortCertificationName,
                sortEndDate,
                limit,
                offset);

        // Chuyển đổi Object[] thành EmployeeDTO sử dụng constructor
        return rows.stream()
                .map(row -> new EmployeeDTO(
                        ((Number) row[0]).longValue(), // employeeId
                        (String) row[1], // employeeName
                        convertSqlDateToLocalDate(row[2]), // employeeBirthDate
                        (String) row[3], // departmentName
                        (String) row[4], // employeeEmail
                        (String) row[5], // employeeTelephone
                        null, // certificationId
                        (String) row[6], // certificationName
                        convertSqlDateToLocalDate(row[7]), // certificationStartDate
                        convertSqlDateToLocalDate(row[8]), // certificationEndDate
                        row[9] != null ? ((Number) row[9]).doubleValue() : null // score
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
     * Đếm tổng số nhân viên không phải quản trị với bộ lọc.
     * 
     * @param employeeName Tên nhân viên
     * @param departmentId Mã phòng ban
     * @return Tổng số nhân viên có role = 0 hoặc role IS NULL theo bộ lọc
     */
    @Override
    public Long countEmployeesWithFilter(String employeeName, Long departmentId) {
        return employeeRepository.countEmployeesWithFilter(employeeName, departmentId);
    }

    /**
     * Lấy chi tiết nhân viên theo ID.
     */
    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        List<Object[]> rows = employeeRepository.getEmployeeById(id);
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Object[] row = rows.get(0);
        // Mapping dữ liệu từ truy vấn native
        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmployeeId(((Number) row[0]).longValue());
        dto.setDepartmentId(((Number) row[1]).longValue());
        dto.setDepartmentName((String) row[2]);
        dto.setEmployeeName((String) row[3]);
        dto.setEmployeeNameKana((String) row[4]);
        dto.setEmployeeBirthDate(convertSqlDateToLocalDate(row[5]));
        dto.setEmployeeEmail((String) row[6]);
        dto.setEmployeeTelephone((String) row[7]);
        dto.setEmployeeLoginId((String) row[8]);
        dto.setCertificationId(row[9] != null ? ((Number) row[9]).longValue() : null);
        dto.setCertificationName((String) row[10]);
        dto.setCertificationStartDate(convertSqlDateToLocalDate(row[11]));
        dto.setCertificationEndDate(convertSqlDateToLocalDate(row[12]));
        dto.setScore(row[13] != null ? ((Number) row[13]).doubleValue() : null);

        return dto;
    }

    @Override
    public EmployeeListResponse buildErrorResponse(String code, String messageCode, List<String> params) {
        EmployeeListResponse response = new EmployeeListResponse();
        // Cấp độ gốc luôn trả về code 500 theo yêu cầu
        response.setCode(Constants.CODE_SYSTEM_ERROR);

        // Trường message chứa JSON String format {code: "", params: []}
        response.setMessage(buildJsonMessage(messageCode, params));

        // Đảm bảo các trường khác là null để không xuất hiện trong JSON
        response.setParams(null);
        response.setTotalRecords(null);
        response.setEmployees(null);

        return response;
    }

    /**
     * Xây dựng chuỗi JSON cho trường message.
     * Format: {"code": "...", "params": [...]}
     * 
     * @param code   Mã lỗi thực tế
     * @param params Danh sách tham số
     * @return Chuỗi JSON
     */
    private String buildJsonMessage(String code, List<String> params) {
        StringBuilder json = new StringBuilder();
        json.append("{\"code\": \"").append(code).append("\", \"params\": [");
        if (params != null && !params.isEmpty()) {
            for (int i = 0; i < params.size(); i++) {
                json.append("\"").append(params.get(i)).append("\"");
                if (i < params.size() - 1) {
                    json.append(", ");
                }
            }
        }
        json.append("]}");
        return json.toString();
    }

    /**
     * Xây dựng response lỗi với mã lỗi và danh sách tham số.
     * 
     * @param errorCode Mã lỗi
     * @return EmployeeListResponse chứa thông tin lỗi
     */
    @Override
    public EmployeeListResponse buildErrorResponse(String errorCode) {
        return buildErrorResponse(errorCode, errorCode, new ArrayList<>());
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
