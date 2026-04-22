/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeValidation.java, April 17, 2026 nxplong
 */

package com.luvina.la.validate;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Lớp EmployeeValidation chứa các logic kiểm tra dữ liệu đầu vào.
 * 
 * @author nxplong
 */
@Component
public class EmployeeValidation {

    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String LOGIN_ID_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_]*$";
    private static final String KATAKANA_PATTERN = "^[\\u30A0-\\u30FF]+$";
    private static final String HALFSIZE_NUMBER_PATTERN = "^[0-9]*$";

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
}
