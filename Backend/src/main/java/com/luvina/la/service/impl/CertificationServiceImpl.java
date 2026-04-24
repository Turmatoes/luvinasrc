/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationServiceImpl.java, April 22, 2026 nxplong
 */
package com.luvina.la.service.impl;

import com.luvina.la.dto.CertificationDTO;
import com.luvina.la.entity.Certification;
import com.luvina.la.repository.CertificationRepository;
import com.luvina.la.service.CertificationService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Triển khai CertificationService.
 */
@Service
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;

    public CertificationServiceImpl(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    /**
     * Lấy danh sách tất cả các chứng chỉ.
     *
     * @return Danh sách các chứng chỉ dưới dạng DTO
     */
    @Override
    public List<CertificationDTO> getAllCertifications() {
        List<Certification> certifications = certificationRepository.findAll();
        return certifications.stream().map(cert -> {
            CertificationDTO dto = new CertificationDTO();
            dto.setCertificationId(cert.getCertificationId());
            dto.setCertificationName(cert.getCertificationName());
            dto.setCertificationLevel(cert.getCertificationLevel());
            return dto;
        }).collect(Collectors.toList());
    }
}
