/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationRequest.java, April 22, 2026 nxplong
 */
package com.luvina.la.payload;

import java.io.Serializable;
import lombok.Data;

/**
 * Request DTO cho thông tin chứng chỉ của nhân viên.
 */
@Data
public class CertificationRequest implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long certificationId;
    private String startDate;
    private String endDate;
    private String score;
}
