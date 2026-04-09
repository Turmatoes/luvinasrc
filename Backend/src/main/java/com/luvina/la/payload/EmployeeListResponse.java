package com.luvina.la.payload;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * API Response for get employees list
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeListResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private Long totalRecords;
    private List<EmployeeListDTO> employees;
}
