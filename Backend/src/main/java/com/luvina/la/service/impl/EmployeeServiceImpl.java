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
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.AddResponse;
import com.luvina.la.payload.EditResponse;
import com.luvina.la.payload.DeleteResponse;
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
     * 
     * @param id - ID nhân viên
     * @return EmployeeDTO chứa thông tin chi tiết nhân viên
     */
    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        List<Object[]> rows = employeeRepository.getEmployeeById(id);
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Object[] row = rows.get(0);
        // Mapping dữ liệu từ truy vấn native
        EmployeeDTO employeeDTO = new EmployeeDTO();
        employeeDTO.setEmployeeId(((Number) row[0]).longValue());
        employeeDTO.setDepartmentId(((Number) row[1]).longValue());
        employeeDTO.setDepartmentName((String) row[2]);
        employeeDTO.setEmployeeName((String) row[3]);
        employeeDTO.setEmployeeNameKana((String) row[4]);
        employeeDTO.setEmployeeBirthDate(convertSqlDateToLocalDate(row[5]));
        employeeDTO.setEmployeeEmail((String) row[6]);
        employeeDTO.setEmployeeTelephone((String) row[7]);
        employeeDTO.setEmployeeLoginId((String) row[8]);
        employeeDTO.setCertificationId(row[9] != null ? ((Number) row[9]).longValue() : null);
        employeeDTO.setCertificationName((String) row[10]);
        employeeDTO.setCertificationStartDate(convertSqlDateToLocalDate(row[11]));
        employeeDTO.setCertificationEndDate(convertSqlDateToLocalDate(row[12]));
        employeeDTO.setScore(row[13] != null ? ((Number) row[13]).doubleValue() : null);

        return employeeDTO;
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
     * @return AddResponse chứa kết quả thêm mới
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public AddResponse addEmployee(EmployeeRequest employeeRequest) {
        try {
            // 1. Tạo entity Employee
            Employee employee = new Employee();
            employee.setEmployeeName(employeeRequest.getEmployeeName());
            employee.setEmployeeNameKana(employeeRequest.getEmployeeNameKana());
            employee.setEmployeeEmail(employeeRequest.getEmployeeEmail());
            employee.setEmployeeTelephone(employeeRequest.getEmployeeTelephone());
            employee.setEmployeeLoginId(employeeRequest.getEmployeeLoginId());
            employee.setEmployeeLoginPassword(passwordEncoder.encode(employeeRequest.getEmployeeLoginPassword()));
            employee.setRole(0); // Mặc định là nhân viên

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            employee.setEmployeeBirthDate(LocalDate.parse(employeeRequest.getEmployeeBirthDate(), formatter));

            Department department = departmentRepository.findById(employeeRequest.getDepartmentId()).orElse(null);
            employee.setDepartment(department);

            // 2. Lưu Employee vào DB
            Employee addEmployee = employeeRepository.save(employee);

            // 3. Nếu có chứng chỉ, lưu vào bảng EmployeeCertification trong DB
            if (employeeRequest.getCertificationId() != null) {
                Certification cert = certificationRepository.findById(employeeRequest.getCertificationId())
                        .orElse(null);
                if (cert != null) {
                    EmployeeCertification employeeCertification = new EmployeeCertification();
                    employeeCertification.setEmployee(addEmployee);
                    employeeCertification.setCertification(cert);
                    employeeCertification
                            .setStartDate(LocalDate.parse(employeeRequest.getCertificationStartDate(), formatter));
                    employeeCertification
                            .setEndDate(LocalDate.parse(employeeRequest.getCertificationEndDate(), formatter));
                    employeeCertification.setScore(new BigDecimal(employeeRequest.getScore()));
                    employeeCertificationRepository.save(employeeCertification);
                }
            }

            // 4. Trả về thành công employee mới được tạo
            return AddResponse.success(addEmployee.getEmployeeId());

        } catch (Exception e) {
            // Nếu có lỗi thì Rollback transaction và trả về ER015
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return AddResponse.error(Constants.CODE_ER015, new java.util.ArrayList<>());
        }
    }

    /**
     * Cập nhật thông tin nhân viên
     *
     * @param request EmployeeRequest chứa thông tin nhân viên
     * @return EditResponse chứa kết quả cập nhật
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public EditResponse updateEmployee(EmployeeRequest employeeRequest) {
        try {
            Employee employee = employeeRepository.findById(employeeRequest.getEmployeeId()).orElse(null);
            if (employee == null) {
                return EditResponse.error(Constants.CODE_ER013, Arrays.asList(Constants.PARAM_EMPLOYEE_ID));
            }

            // Cập nhật thông tin cơ bản (không có Password)
            employee.setEmployeeName(employeeRequest.getEmployeeName());
            employee.setEmployeeNameKana(employeeRequest.getEmployeeNameKana());
            employee.setEmployeeEmail(employeeRequest.getEmployeeEmail());
            employee.setEmployeeTelephone(employeeRequest.getEmployeeTelephone());
            employee.setEmployeeLoginId(employeeRequest.getEmployeeLoginId());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            employee.setEmployeeBirthDate(LocalDate.parse(employeeRequest.getEmployeeBirthDate(), formatter));

            Department department = departmentRepository.findById(employeeRequest.getDepartmentId()).orElse(null);
            employee.setDepartment(department);

            employeeRepository.save(employee);

            // Cập nhật chứng chỉ tiếng Nhật
            // Xóa chứng chỉ cũ trước
            employeeRepository.deleteCertificationsByEmployeeId(employeeRequest.getEmployeeId());

            // Thêm chứng chỉ mới nếu có trong request
            if (employeeRequest.getCertificationId() != null) {
                Certification certification = certificationRepository.findById(employeeRequest.getCertificationId())
                        .orElse(null);
                if (certification != null) {
                    EmployeeCertification employeeCertification = new EmployeeCertification();
                    employeeCertification.setEmployee(employee);
                    employeeCertification.setCertification(certification);
                    employeeCertification
                            .setStartDate(LocalDate.parse(employeeRequest.getCertificationStartDate(), formatter));
                    employeeCertification
                            .setEndDate(LocalDate.parse(employeeRequest.getCertificationEndDate(), formatter));
                    employeeCertification.setScore(new BigDecimal(employeeRequest.getScore()));
                    employeeCertificationRepository.save(employeeCertification);
                }
            }

            return EditResponse.success(employeeRequest.getEmployeeId());

        } catch (Exception e) {
            // Nếu có lỗi thì Rollback transaction và trả về ER015
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return EditResponse.error(Constants.CODE_ER015, new java.util.ArrayList<>());
        }
    }

    /**
     * Xóa nhân viên theo logic thiết kế:
     * 1. Validate parameter
     * 2. Xóa thông tin trình độ tiếng Nhật
     * 3. Xóa thông tin nhân viên
     * 
     * @param employeeId ID nhân viên cần xóa
     * @return DeleteResponse chứa kết quả xóa
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public DeleteResponse deleteEmployee(Long employeeId) {
        // 1. Validate parameter
        if (employeeId == null) {
            return DeleteResponse.error(Constants.CODE_ER001, Arrays.asList(Constants.PARAM_EMPLOYEE_ID));
        }

        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) {
            return DeleteResponse.error(Constants.CODE_ER014, Arrays.asList(Constants.PARAM_EMPLOYEE_ID));
        }

        try {
            // 2. Xóa thông tin trình độ tiếng Nhật của nhân viên (bảng
            // employees_certifications)
            employeeRepository.deleteCertificationsByEmployeeId(employeeId);

            // 3. Xóa thông tin nhân viên (bảng employees)
            employeeRepository.deleteEmployeeById(employeeId);

            // 4. Tạo dữ liệu response cho API (Trường hợp không có lỗi xảy ra)
            return DeleteResponse.success(employeeId);

        } catch (Exception e) {
            // Nếu có lỗi khi xóa thì Rollback transaction
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            // Trả về lỗi với mã lỗi ER015 và chuyển sang bước 4
            return DeleteResponse.error(Constants.CODE_ER015, new java.util.ArrayList<>());
        }
    }

    /**
     * Chuyển đổi java.sql.Date sang java.time.LocalDate.
     * 
     * @param object Đối tượng cần chuyển đổi
     * @return LocalDate đã chuyển đổi
     */
    private LocalDate convertSqlDateToLocalDate(Object object) {
        if (object == null) {
            return null;
        }
        if (object instanceof Date) {
            return ((Date) object).toLocalDate();
        }
        if (object instanceof LocalDate) {
            return (LocalDate) object;
        }
        return null;
    }
}
