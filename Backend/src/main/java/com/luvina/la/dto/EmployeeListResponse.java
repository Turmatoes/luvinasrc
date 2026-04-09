package com.luvina.la.dto;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response wrapper for employee list API
 * Contains pagination info and list of employees
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private Long totalRecords;
    private List<EmployeeDTO> employees;
}
