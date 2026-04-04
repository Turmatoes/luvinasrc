package com.luvina.la.dto;

import java.io.Serializable;
import lombok.Data;

@Data
public class CertificationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long certificationId;
    private String certificationName;
    private Integer certificationLevel;
}
