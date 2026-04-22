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
import com.luvina.la.validate.EmployeeValidation;
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
    private final EmployeeValidation employeeValidation;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository,
            EmployeeCertificationRepository employeeCertificationRepository,
            MessageSource messageSource,
            PasswordEncoder passwordEncoder,
            EmployeeValidation employeeValidation) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
        this.employeeCertificationRepository = employeeCertificationRepository;
        this.messageSource = messageSource;
        this.passwordEncoder = passwordEncoder;
        this.employeeValidation = employeeValidation;
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
     * Validate các tham số cho API lấy danh sách nhân viên.
     * - Kiểm tra các chiều sắp xếp hợp lệ (asc/desc) (ER021)
     * - Kiểm tra offset >= 0 (ER018)
     * - Kiểm tra limit >= 0 (ER018)
     * - Kiểm tra độ dài tên nhân viên <= MAX_EMPLOYEE_NAME_LENGTH (ER006)
     */
    @Override
    public EmployeeResponse validateListParams(
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer offset,
            Integer limit,
            String employeeName) {
        // Validate sort params
        if (!employeeValidation.isValidSort(sortEmployeeName)
                || !employeeValidation.isValidSort(sortCertificationName)
                || !employeeValidation.isValidSort(sortEndDate)) {
            return buildErrorResponse(Constants.CODE_ER021);
        }
        // Validate offset
        if (!employeeValidation.isPositiveInteger(offset)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList("オフセット"));
        }
        // Validate limit
        if (!employeeValidation.isPositiveInteger(limit)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList("リミット"));
        }
        // Validate employee_name length
        if (!employeeValidation.isValidMaxLength(employeeName, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                            String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
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
        return employeeValidation.escapeLikePattern(employeeName);
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

    /**
     * 1.1 Validate [employee_login_id].
     * - Bắt buộc nhập (ER001)
     * - Không vượt quá MAX_LOGIN_ID_LENGTH ký tự (ER006)
     * - Phải đúng định dạng (chữ/số/gạch dưới, bắt đầu bằng chữ hoặc _) (ER019)
     * - Không được trùng với login_id đã có trong DB (ER003)
     */
    @Override
    public EmployeeResponse validateLoginId(String loginId) {
        if (loginId == null || loginId.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
        }
        if (!employeeValidation.isValidMaxLength(loginId, Constants.MAX_LOGIN_ID_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_LOGIN_ID, String.valueOf(Constants.MAX_LOGIN_ID_LENGTH)));
        }
        if (!employeeValidation.isValidLoginId(loginId)) {
            return buildErrorResponse(Constants.CODE_ER019);
        }
        if (checkExistsLoginId(loginId)) {
            return buildErrorResponse(Constants.CODE_ER003, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
        }
        return null;
    }

    /**
     * 1.2 Validate [employee_name].
     * - Bắt buộc nhập (ER001)
     * - Không vượt quá MAX_EMPLOYEE_NAME_LENGTH ký tự (ER006)
     */
    @Override
    public EmployeeResponse validateEmployeeName(String name) {
        if (name == null || name.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME));
        }
        if (!employeeValidation.isValidMaxLength(name, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
    }

    /**
     * 1.3 Validate [employee_name_kana].
     * - Bắt buộc nhập (ER001)
     * - Không vượt quá MAX_EMPLOYEE_NAME_KANA_LENGTH ký tự (ER006)
     * - Chỉ được chứa ký tự Katakana (ER009)
     */
    @Override
    public EmployeeResponse validateNameKana(String nameKana) {
        if (nameKana == null || nameKana.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
        }
        if (!employeeValidation.isValidMaxLength(nameKana, Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_NAME_KANA,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)));
        }
        if (!employeeValidation.isValidKatakana(nameKana)) {
            return buildErrorResponse(Constants.CODE_ER009, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
        }
        return null;
    }

    /**
     * 1.4 Validate [employee_birth_date].
     * - Bắt buộc nhập (ER001)
     * - Phải đúng định dạng yyyy/MM/dd (ER011)
     */
    @Override
    public EmployeeResponse validateBirthDate(String birthDate) {
        if (birthDate == null || birthDate.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
        }
        if (!employeeValidation.isValidDateFormat(birthDate)) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
        }
        return null;
    }

    /**
     * 1.5 Validate [employee_email].
     * - Bắt buộc nhập (ER001)
     * - Không vượt quá MAX_EMAIL_LENGTH ký tự (ER006)
     * - Phải đúng định dạng email (ER005)
     * - Không được trùng với email đã có trong DB (ER003)
     */
    @Override
    public EmployeeResponse validateEmail(String email) {
        if (email == null || email.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMAIL));
        }
        if (!employeeValidation.isValidMaxLength(email, Constants.MAX_EMAIL_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMAIL, String.valueOf(Constants.MAX_EMAIL_LENGTH)));
        }
        if (!employeeValidation.isValidEmail(email)) {
            return buildErrorResponse(Constants.CODE_ER005, java.util.Arrays.asList(Constants.PARAM_EMAIL, "email"));
        }
        return null;
    }

    /**
     * 1.6 Validate [employee_telephone].
     * - Bắt buộc nhập (ER001)
     * - Không vượt quá MAX_TELEPHONE_LENGTH ký tự (ER006)
     * - Chỉ được chứa số (ER008)
     */
    @Override
    public EmployeeResponse validateTelephone(String telephone) {
        if (telephone == null || telephone.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
        }
        if (!employeeValidation.isValidMaxLength(telephone, Constants.MAX_TELEPHONE_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_TELEPHONE, String.valueOf(Constants.MAX_TELEPHONE_LENGTH)));
        }
        if (!employeeValidation.isHalfsizeNumber(telephone)) {
            return buildErrorResponse(Constants.CODE_ER008, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
        }
        return null;
    }

    /**
     * 1.7 Validate [employee_login_password].
     * - Bắt buộc nhập (ER001)
     * - Độ dài từ 6-32 ký tự (ER007)
     * - Phải đúng định dạng (chữ/số/gạch dưới, bắt đầu bằng chữ hoặc _) (ER019)
     */
    @Override
    public EmployeeResponse validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_PASSWORD));
        }
        if (!employeeValidation.isValidMinLength(password, Constants.MIN_PASSWORD_LENGTH)
                || !employeeValidation.isValidMaxLength(password, Constants.MAX_PASSWORD_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER007, java.util.Arrays.asList(
                    Constants.PARAM_PASSWORD,
                    String.valueOf(Constants.MIN_PASSWORD_LENGTH),
                    String.valueOf(Constants.MAX_PASSWORD_LENGTH)));
        }
        return null;
    }

    /**
     * 1.8 Validate [employee_login_password_confirm].
     * - Bắt buộc nhập (ER001)
     * - Phải giống với [employee_login_password] (ER017)
     */
    @Override
    public EmployeeResponse validatePasswordConfirm(String password, String passwordConfirm) {
        if (!password.equals(passwordConfirm)) {
            return buildErrorResponse(Constants.CODE_ER017);
        }
        return null;
    }

    /**
     * 1.9 Validate [department_id].
     * - Bắt buộc nhập (ER001)
     * - Phải tồn tại trong DB (ER004)
     */
    @Override
    public EmployeeResponse validateDepartment(Long departmentId) {
        if (departmentId == null) {
            return buildErrorResponse(Constants.CODE_ER002, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
        }
        if (!checkExistsDepartment(departmentId)) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
        }
        return null;
    }

    /**
     * 2.1 Validate [certification_id].
     * - Bắt buộc nhập (ER001)
     * - Phải tồn tại trong DB (ER004)
     */
    @Override
    public EmployeeResponse validateCertification(EmployeeRequest request) {
        if (request.getCertificationId() == null) {
            return null; // Không chọn chứng chỉ -> bỏ qua
        }
        if (!checkExistsCertification(request.getCertificationId())) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_CERTIFICATION));
        }
        // Validate ngày bắt đầu
        if (request.getCertificationStartDate() == null || request.getCertificationStartDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_START_DATE));
        }
        if (!employeeValidation.isValidDateFormat(request.getCertificationStartDate())) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_START_DATE));
        }
        // Validate ngày kết thúc
        if (request.getCertificationEndDate() == null || request.getCertificationEndDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_END_DATE));
        }
        if (!employeeValidation.isValidDateFormat(request.getCertificationEndDate())) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_END_DATE));
        }
        // Ngày kết thúc phải sau ngày bắt đầu (ER012)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate start = LocalDate.parse(request.getCertificationStartDate(), fmt);
        LocalDate end = LocalDate.parse(request.getCertificationEndDate(), fmt);
        if (!end.isAfter(start)) {
            return buildErrorResponse(Constants.CODE_ER012, java.util.Arrays.asList(Constants.PARAM_START_DATE));
        }
        // Validate điểm số
        if (request.getScore() == null || request.getScore().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_SCORE));
        }
        if (!employeeValidation.isHalfsizeNumber(request.getScore())) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList(Constants.PARAM_SCORE));
        }
        return null;
    }
}
