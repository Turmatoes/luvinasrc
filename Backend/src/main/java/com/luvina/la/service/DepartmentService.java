/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * DepartmentService.java, April 9, 2026 nxplong
 */

package com.luvina.la.service;

import com.luvina.la.dto.DepartmentDTO;
import java.util.List;

/**
 * Giao diện dịch vụ phòng ban.
 * Định nghĩa các phương thức xử lý logic kinh doanh cho phòng ban.
 */
public interface DepartmentService {

    /**
     * Lấy danh sách tất cả các phòng ban.
     * 
     * @return Danh sách DepartmentDTO
     */
    List<DepartmentDTO> getAllDepartments();
}
