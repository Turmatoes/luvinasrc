/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeValidate.java, April 17, 2026 nxplong
 */

package com.luvina.la.validate;

import com.luvina.la.config.Constants;
import com.luvina.la.payload.EmployeeRequest;
import com.luvina.la.payload.ErrorResponse;
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

    /**
     * Constructor để check exist LoginID, Department, Certification
     * 
     * @param employeeRepository      Repo employee
     * @param departmentRepository    Repo department
     * @param certificationRepository Repo certification
     */
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
     * 
     * @param sort Tham số sắp xếp
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidSort(String sort) {
        if (sort == null || sort.isEmpty())
            return true;
        String val = sort.trim().toLowerCase();
        return "asc".equals(val) || "desc".equals(val);
    }

    /**
     * Kiểm tra xem giá trị có phải là số nguyên dương hay không (>= 0).
     *
     * @param val Số nguyên cần kiểm tra
     * @return true nếu là số nguyên dương, false nếu không
     */
    public boolean isPositiveInteger(Integer val) {
        if (val == null)
            return true;
        return val >= 0;
    }

    /**
     * Kiểm tra độ dài tối đa của chuỗi.
     *
     * @param value     Chuỗi cần kiểm tra
     * @param maxLength Độ dài tối đa
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidMaxLength(String value, int maxLength) {
        if (value == null) {
            return true;
        }
        return value.length() <= maxLength;
    }

    /**
     * Kiểm tra độ dài tối thiểu của chuỗi.
     *
     * @param value     Chuỗi cần kiểm tra
     * @param minLength Độ dài tối thiểu
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidMinLength(String value, int minLength) {
        if (value == null) {
            return false;
        }
        return value.length() >= minLength;
    }

    /**
     * Kiểm tra định dạng Login ID (ER019).
     *
     * @param loginId Login ID cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidLoginId(String loginId) {
        if (loginId == null || loginId.isEmpty())
            return true;
        return Pattern.matches(LOGIN_ID_PATTERN, loginId);
    }

    /**
     * Kiểm tra định dạng Email (ER005).
     *
     * @param email Email cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty())
            return true;
        return Pattern.matches(EMAIL_PATTERN, email);
    }

    /**
     * Kiểm tra định dạng Katakana (ER009).
     *
     * @param text Chuỗi cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidKatakana(String text) {
        if (text == null || text.isEmpty())
            return true;
        return Pattern.matches(KATAKANA_PATTERN, text);
    }

    /**
     * Kiểm tra định dạng số Halfsize (ER008/ER018).
     *
     * @param text Chuỗi cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isHalfsizeNumber(String text) {
        if (text == null || text.isEmpty())
            return true;
        return Pattern.matches(HALFSIZE_NUMBER_PATTERN, text);
    }

    /**
     * Kiểm tra định dạng ngày tháng yyyy/MM/dd.
     *
     * @param date Ngày tháng cần kiểm tra
     * @return true nếu hợp lệ, false nếu không hợp lệ
     */
    public boolean isValidDateFormat(String date) {
        if (date == null || date.isEmpty())
            return true;
        try {
            String[] parts = date.split("/");
            if (parts.length != 3)
                return false;
            Integer.parseInt(parts[0]); // Vẫn parse để check format nhưng không gán biến
            int month = Integer.parseInt(parts[1]);
            int day = Integer.parseInt(parts[2]);
            if (month < 1 || month > 12)
                return false;
            if (day < 1 || day > 31)
                return false;
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Escape các ký tự đặc biệt cho toán tử LIKE.
     *
     * @param value Chuỗi cần xử lý
     * @return Chuỗi đã xử lý
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
     *
     * @param errorCode Mã lỗi
     * @param params    Tham số lỗi
     * @return EmployeeResponse chứa mã lỗi và tham số lỗi
     */
    public ErrorResponse buildErrorResponse(String errorCode, List<String> params) {
        ErrorResponse response = new ErrorResponse();
        response.setCode(errorCode);
        response.setParams(params != null ? params : new ArrayList<>());
        return response;
    }

    public ErrorResponse buildErrorResponse(String errorCode) {
        return buildErrorResponse(errorCode, null);
    }

    // =====================================================================
    // Các phương thức validate từ 1.1 đến 2.1
    // =====================================================================

    public ErrorResponse validateEmployee(EmployeeRequest request) {
        ErrorResponse employeeResponse;

        // 1.1 Validate [employee_login_id]
        employeeResponse = validateLoginId(request.getEmployeeLoginId());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.2 Validate [employee_name]
        employeeResponse = validateEmployeeName(request.getEmployeeName());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.3 Validate [employee_name_kana]
        employeeResponse = validateNameKana(request.getEmployeeNameKana());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.4 Validate [employee_birth_date]
        employeeResponse = validateBirthDate(request.getEmployeeBirthDate());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.5 Validate [employee_email]
        employeeResponse = validateEmail(request.getEmployeeEmail());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.6 Validate [employee_telephone]
        employeeResponse = validateTelephone(request.getEmployeeTelephone());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.7 Validate [employee_login_password]
        employeeResponse = validatePassword(request.getEmployeeLoginPassword());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.8 Validate [department_id]
        employeeResponse = validateDepartment(request.getDepartmentId());
        if (employeeResponse != null)
            return employeeResponse;

        // 1.9 Validate Certification (nếu có chọn)
        employeeResponse = validateCertification(request);
        if (employeeResponse != null)
            return employeeResponse;

        return buildErrorResponse(Constants.CODE_SUCCESS);
    }

    /**
     * Validate Login ID.
     * 
     * @param loginId Login ID cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateLoginId(String loginId) {
        // Check [employee_login_id] required (ER001)
        if (loginId == null || loginId.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
            // Check [employee_login_id] max length (ER006)
        } else if (!isValidMaxLength(loginId, Constants.MAX_LOGIN_ID_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_LOGIN_ID, String.valueOf(Constants.MAX_LOGIN_ID_LENGTH)));
            // Check [employee_login_id] format (ER019)
        } else if (!isValidLoginId(loginId)) {
            return buildErrorResponse(Constants.CODE_ER019);
            // Check [employee_login_id] existence (ER003)
        } else if (employeeRepository.findByEmployeeLoginId(loginId).isPresent()) {
            return buildErrorResponse(Constants.CODE_ER003, java.util.Arrays.asList(Constants.PARAM_LOGIN_ID));
        }
        return null;
    }

    /**
     * Validate Employee Name.
     * 
     * @param name Tên nhân viên cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateEmployeeName(String name) {
        // Check [employee_name] required (ER001)
        if (name == null || name.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME));
            // Check [employee_name] max length (ER006)
        } else if (!isValidMaxLength(name, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
    }

    /**
     * Validate Name Kana.
     * 
     * @param nameKana Tên nhân viên (Kana) cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateNameKana(String nameKana) {
        // Check [employee_name_kana] required (ER001)
        if (nameKana == null || nameKana.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
            // Check [employee_name_kana] max length (ER006)
        } else if (!isValidMaxLength(nameKana, Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006, java.util.Arrays.asList(Constants.PARAM_NAME_KANA,
                    String.valueOf(Constants.MAX_EMPLOYEE_NAME_KANA_LENGTH)));
            // Check [employee_name_kana] format Katakana (ER009)
        } else if (!isValidKatakana(nameKana)) {
            return buildErrorResponse(Constants.CODE_ER009, java.util.Arrays.asList(Constants.PARAM_NAME_KANA));
        }
        return null;
    }

    /**
     * Validate Birth Date.
     * 
     * @param birthDate Ngày sinh cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateBirthDate(String birthDate) {
        // Check [employee_birth_date] required (ER001)
        if (birthDate == null || birthDate.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
            // Check [employee_birth_date] format (ER011)
        } else if (!isValidDateFormat(birthDate)) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_BIRTH_DATE));
        }
        return null;
    }

    /**
     * Validate Email.
     * 
     * @param email Email cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateEmail(String email) {
        // Check [employee_email] required (ER001)
        if (email == null || email.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_EMAIL));
            // Check [employee_email] max length (ER006)
        } else if (!isValidMaxLength(email, Constants.MAX_EMAIL_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMAIL, String.valueOf(Constants.MAX_EMAIL_LENGTH)));
            // Check [employee_email] format (ER005)
        } else if (!isValidEmail(email)) {
            return buildErrorResponse(Constants.CODE_ER005, java.util.Arrays.asList(Constants.PARAM_EMAIL, "email"));
        }
        return null;
    }

    /**
     * Validate Telephone.
     * 
     * @param telephone Số điện thoại cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateTelephone(String telephone) {
        // Check [employee_telephone] required (ER001)
        if (telephone == null || telephone.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
            // Check [employee_telephone] max length (ER006)
        } else if (!isValidMaxLength(telephone, Constants.MAX_TELEPHONE_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_TELEPHONE, String.valueOf(Constants.MAX_TELEPHONE_LENGTH)));
            // Check [employee_telephone] format (ER008)
        } else if (!isHalfsizeNumber(telephone)) {
            return buildErrorResponse(Constants.CODE_ER008, java.util.Arrays.asList(Constants.PARAM_TELEPHONE));
        }
        return null;
    }

    /**
     * Validate Password.
     * 
     * @param password Mật khẩu cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validatePassword(String password) {
        // Check [employee_login_password] required (ER001)
        if (password == null || password.isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_PASSWORD));
            // Check [employee_login_password] min/max length (ER007)
        } else if (!isValidMinLength(password, Constants.MIN_PASSWORD_LENGTH)
                || !isValidMaxLength(password, Constants.MAX_PASSWORD_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER007, java.util.Arrays.asList(
                    Constants.PARAM_PASSWORD,
                    String.valueOf(Constants.MIN_PASSWORD_LENGTH),
                    String.valueOf(Constants.MAX_PASSWORD_LENGTH)));
        }
        return null;
    }

    /**
     * Validate Department.
     * 
     * @param departmentId ID phòng ban cần validate
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateDepartment(Long departmentId) {
        // Check [department_id] required (ER002)
        if (departmentId == null) {
            return buildErrorResponse(Constants.CODE_ER002, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
            // Check [department_id] existence (ER004)
        } else if (!departmentRepository.existsById(departmentId)) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_DEPARTMENT));
        }
        return null;
    }

    /**
     * Validate Certification.
     * 
     * @param request EmployeeRequest chứa thông tin chứng chỉ
     * @return EmployeeResponse chứa mã lỗi (nếu có lỗi) hoặc null (nếu không có
     *         lỗi)
     */
    public ErrorResponse validateCertification(EmployeeRequest request) {
        // Check [certification_id] non-null (skip if null)
        if (request.getCertificationId() == null) {
            return null; // Không chọn chứng chỉ -> bỏ qua
            // Check [certification_id] existence (ER004)
        } else if (!certificationRepository.existsById(request.getCertificationId())) {
            return buildErrorResponse(Constants.CODE_ER004, java.util.Arrays.asList(Constants.PARAM_CERTIFICATION));
            // Check [certification_start_date] required (ER001)
        } else if (request.getCertificationStartDate() == null || request.getCertificationStartDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_START_DATE));
            // Check [certification_start_date] format (ER011)
        } else if (!isValidDateFormat(request.getCertificationStartDate())) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_START_DATE));
            // Check [certification_end_date] required (ER001)
        } else if (request.getCertificationEndDate() == null || request.getCertificationEndDate().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_END_DATE));
            // Check [certification_end_date] format (ER011)
        } else if (!isValidDateFormat(request.getCertificationEndDate())) {
            return buildErrorResponse(Constants.CODE_ER011, java.util.Arrays.asList(Constants.PARAM_END_DATE));
            // Check [score] required (ER001)
        } else if (request.getScore() == null || request.getScore().isEmpty()) {
            return buildErrorResponse(Constants.CODE_ER001, java.util.Arrays.asList(Constants.PARAM_SCORE));
            // Check [score] format (ER018)
        } else if (!isHalfsizeNumber(request.getScore())) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList(Constants.PARAM_SCORE));
        } else {
            // Check [certification_end_date] after [certification_start_date] (ER012)
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy/MM/dd");
            LocalDate start = LocalDate.parse(request.getCertificationStartDate(), fmt);
            LocalDate end = LocalDate.parse(request.getCertificationEndDate(), fmt);
            if (!end.isAfter(start)) {
                return buildErrorResponse(Constants.CODE_ER012, java.util.Arrays.asList(Constants.PARAM_START_DATE));
            }
        }
        return null;
    }

    /**
     * Validate các tham số cho API lấy danh sách nhân viên.
     *
     * @param sortEmployeeName      Sắp xếp tên nhân viên
     * @param sortCertificationName Sắp xếp tên chứng chỉ
     * @param sortEndDate           Sắp xếp ngày kết thúc
     * @param offset                Offset
     * @param limit                 Limit
     * @param employeeName          Tên nhân viên
     * @return EmployeeResponse chứa mã lỗi và tham số lỗi
     */
    public ErrorResponse validateListParams(
            String sortEmployeeName,
            String sortCertificationName,
            String sortEndDate,
            Integer offset,
            Integer limit,
            String employeeName) {
        // Validate sort params (ER021)
        if (!isValidSort(sortEmployeeName)
                || !isValidSort(sortCertificationName)
                || !isValidSort(sortEndDate)) {
            return buildErrorResponse(Constants.CODE_ER021);
        }
        // Validate offset (ER018)
        if (!isPositiveInteger(offset)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList(Constants.PARAM_OFFSET));
        }
        // Validate limit (ER018)
        if (!isPositiveInteger(limit)) {
            return buildErrorResponse(Constants.CODE_ER018, java.util.Arrays.asList(Constants.PARAM_LIMIT));
        }
        // Validate độ dài employee_name (ER006)
        if (!isValidMaxLength(employeeName, Constants.MAX_EMPLOYEE_NAME_LENGTH)) {
            return buildErrorResponse(Constants.CODE_ER006,
                    java.util.Arrays.asList(Constants.PARAM_EMPLOYEE_NAME,
                            String.valueOf(Constants.MAX_EMPLOYEE_NAME_LENGTH)));
        }
        return null;
    }
}
