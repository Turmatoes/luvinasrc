/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * DepartmentDTO.java, April 9, 2026 nxplong
 */
package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

/**
 * DTO Department chứa thông tin phòng ban.
 * 
 * @author nxplong
 */
@Data
public class DepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long departmentId;
    private String departmentName;
}
