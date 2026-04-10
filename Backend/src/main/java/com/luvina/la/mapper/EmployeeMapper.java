/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeMapper.java, April 9, 2026 nxplong
 */
package com.luvina.la.mapper;

import com.luvina.la.dto.EmployeeDTO;
import com.luvina.la.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

/**
 * Interface EmployeeMapper chứa thông tin nhân viên.
 * 
 * @author nxplong
 */
@Mapper
public interface EmployeeMapper {
    EmployeeMapper MAPPER = Mappers.getMapper(EmployeeMapper.class);

    @Mapping(source = "departmentId", target = "department.departmentId")
    Employee toEntity(EmployeeDTO dto);

    @Mapping(source = "department.departmentId", target = "departmentId")
    @Mapping(source = "department.departmentName", target = "departmentName")
    EmployeeDTO toDto(Employee entity);

    Iterable<EmployeeDTO> toList(Iterable<Employee> list);
}
