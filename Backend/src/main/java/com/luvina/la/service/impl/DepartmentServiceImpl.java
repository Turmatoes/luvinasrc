/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * DepartmentServiceImpl.java, April 9, 2026 nxplong
 */

package com.luvina.la.service.impl;

import com.luvina.la.dto.DepartmentDTO;
import com.luvina.la.entity.Department;
import com.luvina.la.repository.DepartmentRepository;
import com.luvina.la.service.DepartmentService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Thực hiện dịch vụ phòng ban (DepartmentService).
 * Xử lý logic kinh doanh cho các thao tác phòng ban.
 * 
 * @author nxplong
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    /**
     * Constructor khởi tạo DepartmentServiceImpl.
     *
     * @param departmentRepository Repository xử lý dữ liệu phòng ban
     */
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    /**
     * Lấy danh sách tất cả các phòng ban.
     * 
     * @return Danh sách DepartmentDTO
     */
    @Override
    public List<DepartmentDTO> getAllDepartments() {
        // Lấy tất cả các phòng ban từ repository
        List<Department> departments = (List<Department>) departmentRepository.findAll();
        
        // Chuyển đổi sang DTO
        return departments.stream()
                .map(dept -> {
                    DepartmentDTO dto = new DepartmentDTO();
                    dto.setDepartmentId(dept.getDepartmentId());
                    dto.setDepartmentName(dept.getDepartmentName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
