package com.okta.developer.store.repository;

import com.okta.developer.store.domain.Store;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Store entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoreRepository extends MongoRepository<Store, String> {}
