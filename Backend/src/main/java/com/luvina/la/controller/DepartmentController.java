/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * DepartmentController.java, April 9, 2026 nxplong
 */

package com.luvina.la.controller;

import com.luvina.la.payload.BaseResponse;
import com.luvina.la.service.DepartmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
/**
 * Lớp DepartmentController xử lý các yêu cầu liên quan đến phòng ban.
 * 
 * @author nxplong
 */
public class DepartmentController {

    private final DepartmentService departmentService;

    /**
     * Constructor khởi tạo DepartmentController.
     *
     * @param departmentService Dịch vụ xử lý phòng ban
     */
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * Lấy danh sách tất cả các phòng ban.
     * 
     * @return Danh sách DepartmentDTO hoặc BaseResponse chứa mã lỗi
     */
    @GetMapping("/departments")
    public Object getAllDepartments() {
        try {
            return departmentService.getAllDepartments();
        } catch (Exception e) {
            return BaseResponse.build(com.luvina.la.config.Constants.CODE_ER023);
        }
    }
}
