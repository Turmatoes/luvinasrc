/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeServiceImpl.java, April 9, 2026 nxplong
 */

package com.luvina.la.service.impl;

import com.luvina.la.config.Constants;
import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Certification;
import com.luvina.la.entity.Department;
import com.luvina.la.entity.Employee;
import com.luvina.la.entity.EmployeeCertification;
import com.luvina.la.payload.EmployeeListResponse;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeCertificationRepository;
import com.luvina.la.repository.EmployeeRepository;
import com.luvina.la.service.EmployeeService;
import com.luvina.la.validate.EmployeeValidate;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Thực hiện dịch vụ nhân viên (EmployeeService).
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeCertificationRepository employeeCertificationRepository;
    private final MessageSource messageSource;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeValidate employeeValidate;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeCertificationRepository employeeCertificationRepository,
            MessageSource messageSource,
            PasswordEncoder passwordEncoder,
            EmployeeValidate employeeValidate) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
        this.employeeCertificationRepository = employeeCertificationRepository;
        this.messageSource = messageSource;
        this.passwordEncoder = passwordEncoder;
        this.employeeValidate = employeeValidate;
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
    public EmployeeResponse buildErrorResponse(String errorCode, List<String> params) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(errorCode);
        response.setParams(params != null ? params : new java.util.ArrayList<>());
        return response;
    }

    @Override
    public EmployeeResponse buildErrorResponse(String errorCode) {
        return buildErrorResponse(errorCode, null);
    }

    @Override
    public boolean checkExistsLoginId(String loginId) {
        return employeeRepository.findByEmployeeLoginId(loginId).isPresent();
    }


    /**
     * Escape ký tự đặc biệt trong tên nhân viên cho LIKE query.
     * Trả về null nếu tên rỗng (không lọc theo tên).
     */
    @Override
    public String escapeEmployeeName(String employeeName) {
        if (employeeName == null || employeeName.isEmpty()) {
            return null;
        }
        return employeeValidate.escapeLikePattern(employeeName);
    }

    @Override
    public boolean checkExistsDepartment(Long departmentId) {
        return departmentRepository.existsById(departmentId);
    }

    @Override
    public boolean checkExistsCertification(Long certificationId) {
        return certificationRepository.existsById(certificationId);
    }

    @Override
    @Transactional
    public EmployeeResponse addEmployee(EmployeeRequest request) {
        try {
            // 1. Tạo entity Employee
            Employee employee = new Employee();
            employee.setEmployeeName(request.getEmployeeName());
            employee.setEmployeeNameKana(request.getEmployeeNameKana());
            employee.setEmployeeEmail(request.getEmployeeEmail());
            employee.setEmployeeTelephone(request.getEmployeeTelephone());
            employee.setEmployeeLoginId(request.getEmployeeLoginId());
            employee.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
            employee.setRole(0); // Mặc định là nhân viên

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            employee.setEmployeeBirthDate(LocalDate.parse(request.getEmployeeBirthDate(), formatter));

            Department dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
            employee.setDepartment(dept);

            // 2. Lưu Employee
            Employee savedEmployee = employeeRepository.save(employee);

            // 3. Nếu có chứng chỉ, lưu vào bảng phụ
            if (request.getCertificationId() != null) {
                Certification cert = certificationRepository.findById(request.getCertificationId()).orElse(null);
                if (cert != null) {
                    EmployeeCertification empCert = new EmployeeCertification();
                    empCert.setEmployee(savedEmployee);
                    empCert.setCertification(cert);
                    empCert.setStartDate(LocalDate.parse(request.getCertificationStartDate(), formatter));
                    empCert.setEndDate(LocalDate.parse(request.getCertificationEndDate(), formatter));
                    empCert.setScore(new BigDecimal(request.getScore()));
                    employeeCertificationRepository.save(empCert);
                }
            }

            // 4. Trả về thành công
            EmployeeResponse response = new EmployeeResponse();
            response.setCode(Constants.CODE_SUCCESS);
            return response;

        } catch (Exception e) {
            return buildErrorResponse(Constants.CODE_ER023);
        }
    }

    /**
     * Chuyển đổi java.sql.Date sang java.time.LocalDate.
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
