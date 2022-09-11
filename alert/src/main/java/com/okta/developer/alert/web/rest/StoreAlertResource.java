package com.okta.developer.alert.web.rest;

import com.okta.developer.alert.domain.StoreAlert;
import com.okta.developer.alert.repository.StoreAlertRepository;
import com.okta.developer.alert.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.okta.developer.alert.domain.StoreAlert}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StoreAlertResource {

    private final Logger log = LoggerFactory.getLogger(StoreAlertResource.class);

    private static final String ENTITY_NAME = "alertStoreAlert";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StoreAlertRepository storeAlertRepository;

    public StoreAlertResource(StoreAlertRepository storeAlertRepository) {
        this.storeAlertRepository = storeAlertRepository;
    }

    /**
     * {@code POST  /store-alerts} : Create a new storeAlert.
     *
     * @param storeAlert the storeAlert to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new storeAlert, or with status {@code 400 (Bad Request)} if the storeAlert has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/store-alerts")
    public ResponseEntity<StoreAlert> createStoreAlert(@Valid @RequestBody StoreAlert storeAlert) throws URISyntaxException {
        log.debug("REST request to save StoreAlert : {}", storeAlert);
        if (storeAlert.getId() != null) {
            throw new BadRequestAlertException("A new storeAlert cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StoreAlert result = storeAlertRepository.save(storeAlert);
        return ResponseEntity
            .created(new URI("/api/store-alerts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /store-alerts/:id} : Updates an existing storeAlert.
     *
     * @param id the id of the storeAlert to save.
     * @param storeAlert the storeAlert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeAlert,
     * or with status {@code 400 (Bad Request)} if the storeAlert is not valid,
     * or with status {@code 500 (Internal Server Error)} if the storeAlert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/store-alerts/{id}")
    public ResponseEntity<StoreAlert> updateStoreAlert(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StoreAlert storeAlert
    ) throws URISyntaxException {
        log.debug("REST request to update StoreAlert : {}, {}", id, storeAlert);
        if (storeAlert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeAlert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeAlertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        StoreAlert result = storeAlertRepository.save(storeAlert);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, storeAlert.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /store-alerts/:id} : Partial updates given fields of an existing storeAlert, field will ignore if it is null
     *
     * @param id the id of the storeAlert to save.
     * @param storeAlert the storeAlert to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeAlert,
     * or with status {@code 400 (Bad Request)} if the storeAlert is not valid,
     * or with status {@code 404 (Not Found)} if the storeAlert is not found,
     * or with status {@code 500 (Internal Server Error)} if the storeAlert couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/store-alerts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StoreAlert> partialUpdateStoreAlert(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StoreAlert storeAlert
    ) throws URISyntaxException {
        log.debug("REST request to partial update StoreAlert partially : {}, {}", id, storeAlert);
        if (storeAlert.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeAlert.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeAlertRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StoreAlert> result = storeAlertRepository
            .findById(storeAlert.getId())
            .map(existingStoreAlert -> {
                if (storeAlert.getStoreName() != null) {
                    existingStoreAlert.setStoreName(storeAlert.getStoreName());
                }
                if (storeAlert.getStoreStatus() != null) {
                    existingStoreAlert.setStoreStatus(storeAlert.getStoreStatus());
                }
                if (storeAlert.getTimestamp() != null) {
                    existingStoreAlert.setTimestamp(storeAlert.getTimestamp());
                }

                return existingStoreAlert;
            })
            .map(storeAlertRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, storeAlert.getId().toString())
        );
    }

    /**
     * {@code GET  /store-alerts} : get all the storeAlerts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of storeAlerts in body.
     */
    @GetMapping("/store-alerts")
    public List<StoreAlert> getAllStoreAlerts() {
        log.debug("REST request to get all StoreAlerts");
        return storeAlertRepository.findAll();
    }

    /**
     * {@code GET  /store-alerts/:id} : get the "id" storeAlert.
     *
     * @param id the id of the storeAlert to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the storeAlert, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/store-alerts/{id}")
    public ResponseEntity<StoreAlert> getStoreAlert(@PathVariable Long id) {
        log.debug("REST request to get StoreAlert : {}", id);
        Optional<StoreAlert> storeAlert = storeAlertRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(storeAlert);
    }

    /**
     * {@code DELETE  /store-alerts/:id} : delete the "id" storeAlert.
     *
     * @param id the id of the storeAlert to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/store-alerts/{id}")
    public ResponseEntity<Void> deleteStoreAlert(@PathVariable Long id) {
        log.debug("REST request to delete StoreAlert : {}", id);
        storeAlertRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
