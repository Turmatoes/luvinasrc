package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

@Data
public class DepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long departmentId;
    private String departmentName;
}
