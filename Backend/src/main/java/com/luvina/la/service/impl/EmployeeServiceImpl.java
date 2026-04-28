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
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.ErrorResponse;
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
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import java.util.Arrays;

/**
 * Thực hiện dịch vụ nhân viên (EmployeeService).
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;
    private final EmployeeCertificationRepository employeeCertificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeValidate employeeValidate;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeCertificationRepository employeeCertificationRepository,
            PasswordEncoder passwordEncoder,
            EmployeeValidate employeeValidate) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
        this.employeeCertificationRepository = employeeCertificationRepository;
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


    /**
     * Check tồn tại Login ID
     * 
     * @param loginId Login ID cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    @Override
    public boolean checkExistsLoginId(String loginId) {
        return employeeRepository.findByEmployeeLoginId(loginId).isPresent();
    }

    /**
     * Escape ký tự đặc biệt trong tên nhân viên cho LIKE query.
     * Trả về null nếu tên rỗng (không lọc theo tên).
     * 
     * @param employeeName Tên nhân viên
     * @return Tên nhân viên đã escape
     */
    @Override
    public String escapeEmployeeName(String employeeName) {
        if (employeeName == null || employeeName.isEmpty()) {
            return null;
        }
        return employeeValidate.escapeLikePattern(employeeName);
    }

    /**
     * Check tồn tại Department
     *
     * @param departmentId Mã phòng ban cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    @Override
    public boolean checkExistsDepartment(Long departmentId) {
        return departmentRepository.existsById(departmentId);
    }

    /**
     * Check tồn tại Certification
     *
     * @param certificationId Chứng chỉ cần kiểm tra
     * @return true nếu tồn tại, false nếu không tồn tại
     */
    @Override
    public boolean checkExistsCertification(Long certificationId) {
        return certificationRepository.existsById(certificationId);
    }

    /**
     * Thêm nhân viên mới
     *
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return EmployeeResponse chứa mã lỗi
     */
    @Override
    @Transactional
    public ErrorResponse addEmployee(EmployeeRequest request) {
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

            // 2. Lưu Employee vào DB
            Employee savedEmployee = employeeRepository.save(employee);

            // 3. Nếu có chứng chỉ, lưu vào bảng EmployeeCertification trong DB
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

            // 4. Trả về thành công employee mới được tạo
            EmployeeResponse response = new EmployeeResponse();
            response.setCode(Constants.CODE_SUCCESS);
            return response;

        } catch (Exception e) {
            return ErrorResponse.build(Constants.CODE_ER023);
        }
    }

    /**
     * Cập nhật thông tin nhân viên
     *
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return ErrorResponse chứa mã lỗi
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ErrorResponse updateEmployee(EmployeeRequest request) {
        try {
            Employee employee = employeeRepository.findById(request.getEmployeeId()).orElse(null);
            if (employee == null) {
                return ErrorResponse.build(Constants.CODE_SYSTEM_ERROR, request.getEmployeeId(), Constants.CODE_ER013, Arrays.asList(" ID"));
            }

            // Cập nhật thông tin cơ bản
            employee.setEmployeeName(request.getEmployeeName());
            employee.setEmployeeNameKana(request.getEmployeeNameKana());
            employee.setEmployeeEmail(request.getEmployeeEmail());
            employee.setEmployeeTelephone(request.getEmployeeTelephone());
            employee.setEmployeeLoginId(request.getEmployeeLoginId());

            // Chỉ cập nhật mật khẩu nếu có truyền lên
            if (request.getEmployeeLoginPassword() != null && !request.getEmployeeLoginPassword().isEmpty()) {
                employee.setEmployeeLoginPassword(passwordEncoder.encode(request.getEmployeeLoginPassword()));
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            employee.setEmployeeBirthDate(LocalDate.parse(request.getEmployeeBirthDate(), formatter));

            Department dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
            employee.setDepartment(dept);

            employeeRepository.save(employee);

            // Cập nhật chứng chỉ tiếng Nhật
            // Xóa chứng chỉ cũ trước
            employeeRepository.deleteCertificationsByEmployeeId(request.getEmployeeId());

            // Thêm chứng chỉ mới nếu có trong request
            if (request.getCertificationId() != null) {
                Certification cert = certificationRepository.findById(request.getCertificationId()).orElse(null);
                if (cert != null) {
                    EmployeeCertification empCert = new EmployeeCertification();
                    empCert.setEmployee(employee);
                    empCert.setCertification(cert);
                    empCert.setStartDate(LocalDate.parse(request.getCertificationStartDate(), formatter));
                    empCert.setEndDate(LocalDate.parse(request.getCertificationEndDate(), formatter));
                    empCert.setScore(new BigDecimal(request.getScore()));
                    employeeCertificationRepository.save(empCert);
                }
            }

            return ErrorResponse.build(Constants.CODE_SUCCESS, request.getEmployeeId(), Constants.CODE_MSG002, new java.util.ArrayList<>());

        } catch (Exception e) {
            // Nếu có lỗi thì Rollback transaction và trả về ER015
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ErrorResponse.build(Constants.CODE_SYSTEM_ERROR, request.getEmployeeId(), Constants.CODE_ER015, new java.util.ArrayList<>());
        }
    }


    /**
     * Xóa nhân viên theo logic thiết kế:
     * 1. Validate parameter
     * 2. Xóa thông tin trình độ tiếng Nhật
     * 3. Xóa thông tin nhân viên
     * 
     * @param employeeId ID nhân viên cần xóa
     * @return ErrorResponse chứa kết quả
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ErrorResponse deleteEmployee(Long employeeId) {
        // 1. Validate parameter
        if (employeeId == null) {
            return ErrorResponse.build(Constants.CODE_SYSTEM_ERROR, null, Constants.CODE_ER001, Arrays.asList(" ID"));
        }

        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) {
            return ErrorResponse.build(Constants.CODE_SYSTEM_ERROR, employeeId, Constants.CODE_ER014, Arrays.asList(" ID"));
        }

        try {
            // 2. Xóa thông tin trình độ tiếng Nhật của nhân viên (bảng employees_certifications)
            employeeRepository.deleteCertificationsByEmployeeId(employeeId);

            // 3. Xóa thông tin nhân viên (bảng employees)
            employeeRepository.deleteEmployeeById(employeeId);

            // 4. Tạo dữ liệu response cho API (Trường hợp không có lỗi xảy ra)
            return ErrorResponse.build(Constants.CODE_SUCCESS, employeeId, Constants.CODE_MSG003, new java.util.ArrayList<>());

        } catch (Exception e) {
            // Nếu có lỗi khi xóa thì Rollback transaction
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            // Trả về lỗi với mã lỗi ER015 và chuyển sang bước 4
            return ErrorResponse.build(Constants.CODE_SYSTEM_ERROR, employeeId, Constants.CODE_ER015, new java.util.ArrayList<>());
        }
    }

    /**
     * Chuyển đổi java.sql.Date sang java.time.LocalDate.
     * 
     * @param obj Đối tượng cần chuyển đổi
     * @return LocalDate đã chuyển đổi
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
