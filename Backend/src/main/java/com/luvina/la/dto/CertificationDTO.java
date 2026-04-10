/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationDTO.java, April 9, 2026 nxplong
 */
package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

/**
 * DTO Certification chứa thông tin chứng chỉ.
 * 
 * @author nxplong
 */
@Data
public class CertificationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long certificationId;
    private String certificationName;
    private Integer certificationLevel;
}
