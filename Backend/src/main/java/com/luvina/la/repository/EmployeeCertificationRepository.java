/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * EmployeeCertificationRepository.java, April 9, 2026 nxplong
 */
package com.luvina.la.repository;

import com.luvina.la.entity.EmployeeCertification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface EmployeeCertificationRepository chứa thông tin chứng chỉ của nhân
 * viên.
 * 
 * @author nxplong
 */
@Repository
public interface EmployeeCertificationRepository extends CrudRepository<EmployeeCertification, Long> {
}
