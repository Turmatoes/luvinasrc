/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * CertificationRepository.java, April 9, 2026 nxplong
 */
package com.luvina.la.repository;

import com.luvina.la.entity.Certification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface CertificationRepository chứa thông tin chứng chỉ.
 * 
 * @author nxplong
 */
@Repository
public interface CertificationRepository extends CrudRepository<Certification, Long> {
}
