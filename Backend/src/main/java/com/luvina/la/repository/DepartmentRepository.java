/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * DepartmentRepository.java, April 9, 2026 nxplong
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Department;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface DepartmentRepository chứa thông tin phòng ban.
 * 
 * @author nxplong
 */
@Repository
public interface DepartmentRepository extends CrudRepository<Department, Long> {
}
