/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * Certification.java, April 9, 2026 nxplong
 */
package com.luvina.la.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * Entity Certification chứa thông tin chứng chỉ.
 * 
 * @author nxplong
 */
@Entity
@Table(name = "certifications")
@Data
public class Certification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certification_id")
    private Long certificationId;

    @Column(name = "certification_name", nullable = false, length = 50)
    private String certificationName;

    @Column(name = "certification_level", nullable = false)
    private Integer certificationLevel;
}
