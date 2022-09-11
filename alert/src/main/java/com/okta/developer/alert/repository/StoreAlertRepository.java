package com.okta.developer.alert.repository;

import com.okta.developer.alert.domain.StoreAlert;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StoreAlert entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoreAlertRepository extends JpaRepository<StoreAlert, Long> {}
