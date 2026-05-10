/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationController.java, April 22, 2026 nxplong
 */
package com.luvina.la.controller;

import com.luvina.la.payload.BaseResponse;
import com.luvina.la.service.CertificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các yêu cầu liên quan đến Chứng chỉ.
 */
@RestController
@RequestMapping("/api/certifications")
public class CertificationController {

    private final CertificationService certificationService;

    public CertificationController(CertificationService certificationService) {
        this.certificationService = certificationService;
    }

    /**
     * Lấy danh sách tất cả chứng chỉ.
     * 
     * @return Danh sách CertificationDTO hoặc BaseResponse chứa mã lỗi
     */
    @GetMapping
    public Object getAllCertifications() {
        try {
            return certificationService.getAllCertifications();
        } catch (Exception e) {
            return BaseResponse.build(com.luvina.la.config.Constants.CODE_ER023);
        }
    }
}
