/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationService.java, April 22, 2026 nxplong
 */
package com.luvina.la.service;

import com.luvina.la.dto.CertificationDTO;
import java.util.List;

/**
 * Service interface xử lý các nghiệp vụ liên quan đến Chứng chỉ.
 */
public interface CertificationService {
    /**
     * Lấy danh sách tất cả chứng chỉ.
     * @return Danh sách CertificationDTO
     */
    List<CertificationDTO> getAllCertifications();
}
