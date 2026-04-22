/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationController.java, April 22, 2026 nxplong
 */
package com.luvina.la.controller;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.service.CertificationService;
import java.util.List;
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
     * @return Danh sách CertificationDTO
     */
    @GetMapping
    public List<CertificationDTO> getAllCertifications() {
        return certificationService.getAllCertifications();
    }
}
