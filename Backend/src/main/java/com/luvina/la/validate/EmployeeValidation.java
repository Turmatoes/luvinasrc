/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeValidation.java, April 17, 2026 nxplong
 */

package com.luvina.la.validate;

import org.springframework.stereotype.Component;

/**
 * Lớp EmployeeValidation chứa các logic kiểm tra dữ liệu đầu vào.
 * 
 * @author nxplong
 */
@Component
public class EmployeeValidation {

    /**
     * Kiểm tra tính hợp lệ của tham số sắp xếp.
     * 
     * @param sort Giá trị sắp xếp
     * @return true nếu hợp lệ (asc hoặc desc), ngược lại false
     */
    public boolean isValidSort(String sort) {
        if (sort == null || sort.isEmpty())
            return true;
        String val = sort.trim().toLowerCase();
        return "asc".equals(val) || "desc".equals(val);
    }
}
