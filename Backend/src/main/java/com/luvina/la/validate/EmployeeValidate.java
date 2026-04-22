/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeValidate.java, April 17, 2026 nxplong
 */

package com.luvina.la.validate;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.EmployeeResponse;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.repository.EmployeeRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Lớp EmployeeValidate chứa các logic kiểm tra dữ liệu đầu vào.
 * 
 * @author nxplong
 */
@Component
public class EmployeeValidate {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CertificationRepository certificationRepository;

    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String LOGIN_ID_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";
    private static final String KATAKANA_PATTERN = "^[\\u30A0-\\u30FF]+$";
    private static final String HALFSIZE_NUMBER_PATTERN = "^[0-9]*$";

    public EmployeeValidate(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            CertificationRepository certificationRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.certificationRepository = certificationRepository;
    }

    /**
     * Kiểm tra tính hợp lệ của tham số sắp xếp.
     */
    public boolean isValidSort(String sort) {
        if (sort == null || sort.isEmpty())
            return true;
        String val = sort.trim().toLowerCase();
        return "asc".equals(val) || "desc".equals(val);
    }

    /**
     * Kiểm tra xem giá trị có phải là số nguyên dương hay không (>= 0).
     */
    public boolean isPositiveInteger(Integer val) {
        if (val == null)
            return true;
        return val >= 0;
    }

    /**
     * Kiểm tra độ dài tối đa của chuỗi.
     */
    public boolean isValidMaxLength(String value, int maxLength) {
        if (value == null) {
            return true;
        }
        return value.length() <= maxLength;
    }

    /**
     * Kiểm tra độ dài tối thiểu của chuỗi.
     */
    public boolean isValidMinLength(String value, int minLength) {
        if (value == null) {
            return false;
        }
        return value.length() >= minLength;
    }

    /**
     * Kiểm tra định dạng Login ID (ER019).
     */
    public boolean isValidLoginId(String loginId) {
        if (loginId == null || loginId.isEmpty()) return true;
        return Pattern.matches(LOGIN_ID_PATTERN, loginId);
    }

    /**
     * Kiểm tra định dạng Email (ER005).
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) return true;
        return Pattern.matches(EMAIL_PATTERN, email);
    }

    /**
     * Kiểm tra định dạng Katakana (ER009).
     */
    public boolean isValidKatakana(String text) {
        if (text == null || text.isEmpty()) return true;
        return Pattern.matches(KATAKANA_PATTERN, text);
    }

    /**
     * Kiểm tra định dạng số Halfsize (ER008/ER018).
     */
    public boolean isHalfsizeNumber(String text) {
        if (text == null || text.isEmpty()) return true;
        return Pattern.matches(HALFSIZE_NUMBER_PATTERN, text);
    }

    /**
     * Kiểm tra định dạng ngày tháng yyyy/MM/dd.
     */
    public boolean isValidDateFormat(String date) {
        if (date == null || date.isEmpty()) return true;
        try {
            String[] parts = date.split("/");
            if (parts.length != 3) return false;
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            int day = Integer.parseInt(parts[2]);
            if (month < 1 || month > 12) return false;
            if (day < 1 || day > 31) return false;
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Escape các ký tự đặc biệt cho toán tử LIKE.
     */
    public String escapeLikePattern(String value) {
        if (value == null) {
            return null;
        }

        return value
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }

    /**
     * Xây dựng phản hồi lỗi.
     */
    public EmployeeResponse buildErrorResponse(String errorCode, List<String> params) {
        EmployeeResponse response = new EmployeeResponse();
        response.setCode(errorCode);
        response.setParams(params != null ? params : new ArrayList<>());
        return response;
    }

    public EmployeeResponse buildErrorResponse(String errorCode) {
        return buildErrorResponse(errorCode, null);
    }

    // =====================================================================
    // Các phương thức validate từ 1.1 đến 2.1
    // =====================================================================

    public EmployeeResponse validateEmployee(EmployeeRequest request) {
        EmployeeResponse error;

        // 1.1 Validate [employee_login_id]
        error = validateLoginId(request.getEmployeeLoginId());
        if (error != null) return error;

        // 1.2 Validate [employee_name]
        error = validateEmployeeName(request.getEmployeeName());
        if (error != null) return error;

        // 1.3 Validate [employee_name_kana]
        error = validateNameKana(request.getEmployeeNameKana());
        if (error != null) return error;

        // 1.4 Validate [employee_birth_date]
        error = validateBirthDate(request.getEmployeeBirthDate());
        if (error != null) return error;

        // 1.5 Validate [employee_email]
        error = validateEmail(request.getEmployeeEmail());
        if (error != null) return error;

        // 1.6 Validate [employee_telephone]
        error = validateTelephone(request.getEmployeeTelephone());
        if (error != null) return error;

        // 1.7 Validate [employee_login_password]
        error = validatePassword(request.getEmployeeLoginPassword());
        if (error != null) return error;

        // 1.7+ Validate [employee_login_password_confirm]
        error = validatePasswordConfirm(request.getEmployeeLoginPassword(), request.getEmployeeLoginPasswordConfirm());
        if (error != null) return error;

        // 1.8 Validate [department_id]
        error = validateDepartment(request.getDepartmentId());
        if (error != null) return error;

        // 1.9 Validate Certification (nếu có chọn)
        error = validateCertification(request);
        if (error != null) return error;

        return buildErrorResponse(Constants.CODE_SUCCESS);
    }

    public EmployeeResponse validateLoginId(String loginId) {
        if (loginId == null || loginId.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
        }
        if (!isValidMaxLength(loginId, Constants.MAX_LOGIN_ID_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_LOGIN_ID, String.valueOf(Constants.MAX_LOGIN_ID_LENGTH)));
        }
        if (!isValidLoginId(loginId)) {
            return buildErrorResponse(Constants.CODE_ER019);
        }
        if (employeeRepository.findByEmployeeLoginId(loginId).isPresent()) {
            return buildErrorResponse(Constants.CODE_ER003, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
        }
        return null;
    }

    public EmployeeResponse validateEmployeeName(String name) {
        if (name == null || name.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME));
        }
        if (!isValidMaxLength(name, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
    }

    public EmployeeResponse validateNameKana(String nameKana) {
        if (nameKana == null || nameKana.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
        }
        if (!isValidMaxLength(nameKana, Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_NAME_KANA,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)));
        }
        if (!isValidKatakana(nameKana)) {
            return buildErrorResponse(Constants.CODE_ER009, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
        }
        return null;
    }

    public EmployeeResponse validateBirthDate(String birthDate) {
        if (birthDate == null || birthDate.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
        }
        if (!isValidDateFormat(birthDate)) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
        }
        return null;
    }

    public EmployeeResponse validateEmail(String email) {
        if (email == null || email.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMAIL));
        }
        if (!isValidMaxLength(email, Constants.MAX_EMAIL_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMAIL, String.valueOf(Constants.MAX_EMAIL_LENGTH)));
        }
        if (!isValidEmail(email)) {
            return buildErrorResponse(Constants.CODE_ER005, java.util.Arrays.asList(Constants.PARAM_EMAIL, "email"));
        }
        return null;
    }

    public EmployeeResponse validateTelephone(String telephone) {
        if (telephone == null || telephone.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
        }
        if (!isValidMaxLength(telephone, Constants.MAX_TELEPHONE_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_TELEPHONE, String.valueOf(Constants.MAX_TELEPHONE_LENGTH)));
        }
        if (!isHalfsizeNumber(telephone)) {
            return buildErrorResponse(Constants.CODE_ER008, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
        }
        return null;
    }

    public EmployeeResponse validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_PASSWORD));
        }
        if (!isValidMinLength(password, Constants.MIN_PASSWORD_LENGTH)
                || !isValidMaxLength(password, Constants.MAX_PASSWORD_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER007, java.util.Arrays.asList(
                    Constants.PARAM_PASSWORD,
                    String.valueOf(Constants.MIN_PASSWORD_LENGTH),
                    String.valueOf(Constants.MAX_PASSWORD_LENGTH)));
        }
        return null;
    }

    public EmployeeResponse validatePasswordConfirm(String password, String passwordConfirm) {
        if (!password.equals(passwordConfirm)) {
            return buildErrorResponse(Constants.CODE_ER017);
        }
        return null;
    }

    public EmployeeResponse validateDepartment(Long departmentId) {
        if (departmentId == null) {
            return buildErrorResponse(Constants.CODE_ER002, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
        }
        if (!departmentRepository.existsById(departmentId)) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
        }
        return null;
    }

    public EmployeeResponse validateCertification(EmployeeRequest request) {
        if (request.getCertificationId() == null) {
            return null; // Không chọn chứng chỉ -> bỏ qua
        }
        if (!certificationRepository.existsById(request.getCertificationId())) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_CERTIFICATION));
        }
        // Validate ngày bắt đầu
        if (request.getCertificationStartDate() == null || request.getCertificationStartDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_START_DATE));
        }
        if (!isValidDateFormat(request.getCertificationStartDate())) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_START_DATE));
        }
        // Validate ngày kết thúc
        if (request.getCertificationEndDate() == null || request.getCertificationEndDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_END_DATE));
        }
        if (!isValidDateFormat(request.getCertificationEndDate())) {
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
        if (!isHalfsizeNumber(request.getScore())) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList(Constants.PARAM_SCORE));
        }
        return null;
    }

    /**
     * Validate các tham số cho API lấy danh sách nhân viên.
     */
    public EmployeeResponse validateListParams(
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer offset,
            Integer limit,
            String employeeName) {
        // Validate sort params
        if (!isValidSort(sortEmployeeName)
                || !isValidSort(sortCertificationName)
                || !isValidSort(sortEndDate)) {
            return buildErrorResponse(Constants.CODE_ER021);
        }
        // Validate offset
        if (!isPositiveInteger(offset)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList("オフセット"));
        }
        // Validate limit
        if (!isPositiveInteger(limit)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList("リミット"));
        }
        // Validate employee_name length
        if (!isValidMaxLength(employeeName, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                            String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
    }
}
