package com.okta.developer.alert.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.okta.developer.alert.IntegrationTest;
import com.okta.developer.alert.domain.StoreAlert;
import com.okta.developer.alert.repository.StoreAlertRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link StoreAlertResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StoreAlertResourceIT {

    private static final String DEFAULT_STORE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_STORE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STORE_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STORE_STATUS = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/store-alerts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StoreAlertRepository storeAlertRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStoreAlertMockMvc;

    private StoreAlert storeAlert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreAlert createEntity(EntityManager em) {
        StoreAlert storeAlert = new StoreAlert()
            .storeName(DEFAULT_STORE_NAME)
            .storeStatus(DEFAULT_STORE_STATUS)
            .timestamp(DEFAULT_TIMESTAMP);
        return storeAlert;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreAlert createUpdatedEntity(EntityManager em) {
        StoreAlert storeAlert = new StoreAlert()
            .storeName(UPDATED_STORE_NAME)
            .storeStatus(UPDATED_STORE_STATUS)
            .timestamp(UPDATED_TIMESTAMP);
        return storeAlert;
    }

    @BeforeEach
    public void initTest() {
        storeAlert = createEntity(em);
    }

    @Test
    @Transactional
    void createStoreAlert() throws Exception {
        int databaseSizeBeforeCreate = storeAlertRepository.findAll().size();
        // Create the StoreAlert
        restStoreAlertMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isCreated());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeCreate + 1);
        StoreAlert testStoreAlert = storeAlertList.get(storeAlertList.size() - 1);
        assertThat(testStoreAlert.getStoreName()).isEqualTo(DEFAULT_STORE_NAME);
        assertThat(testStoreAlert.getStoreStatus()).isEqualTo(DEFAULT_STORE_STATUS);
        assertThat(testStoreAlert.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createStoreAlertWithExistingId() throws Exception {
        // Create the StoreAlert with an existing ID
        storeAlert.setId(1L);

        int databaseSizeBeforeCreate = storeAlertRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreAlertMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStoreNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeAlertRepository.findAll().size();
        // set the field null
        storeAlert.setStoreName(null);

        // Create the StoreAlert, which fails.

        restStoreAlertMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStoreStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeAlertRepository.findAll().size();
        // set the field null
        storeAlert.setStoreStatus(null);

        // Create the StoreAlert, which fails.

        restStoreAlertMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeAlertRepository.findAll().size();
        // set the field null
        storeAlert.setTimestamp(null);

        // Create the StoreAlert, which fails.

        restStoreAlertMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStoreAlerts() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        // Get all the storeAlertList
        restStoreAlertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(storeAlert.getId().intValue())))
            .andExpect(jsonPath("$.[*].storeName").value(hasItem(DEFAULT_STORE_NAME)))
            .andExpect(jsonPath("$.[*].storeStatus").value(hasItem(DEFAULT_STORE_STATUS)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getStoreAlert() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        // Get the storeAlert
        restStoreAlertMockMvc
            .perform(get(ENTITY_API_URL_ID, storeAlert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(storeAlert.getId().intValue()))
            .andExpect(jsonPath("$.storeName").value(DEFAULT_STORE_NAME))
            .andExpect(jsonPath("$.storeStatus").value(DEFAULT_STORE_STATUS))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingStoreAlert() throws Exception {
        // Get the storeAlert
        restStoreAlertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewStoreAlert() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();

        // Update the storeAlert
        StoreAlert updatedStoreAlert = storeAlertRepository.findById(storeAlert.getId()).get();
        // Disconnect from session so that the updates on updatedStoreAlert are not directly saved in db
        em.detach(updatedStoreAlert);
        updatedStoreAlert.storeName(UPDATED_STORE_NAME).storeStatus(UPDATED_STORE_STATUS).timestamp(UPDATED_TIMESTAMP);

        restStoreAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStoreAlert.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStoreAlert))
            )
            .andExpect(status().isOk());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
        StoreAlert testStoreAlert = storeAlertList.get(storeAlertList.size() - 1);
        assertThat(testStoreAlert.getStoreName()).isEqualTo(UPDATED_STORE_NAME);
        assertThat(testStoreAlert.getStoreStatus()).isEqualTo(UPDATED_STORE_STATUS);
        assertThat(testStoreAlert.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, storeAlert.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStoreAlertWithPatch() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();

        // Update the storeAlert using partial update
        StoreAlert partialUpdatedStoreAlert = new StoreAlert();
        partialUpdatedStoreAlert.setId(storeAlert.getId());

        partialUpdatedStoreAlert.storeName(UPDATED_STORE_NAME).storeStatus(UPDATED_STORE_STATUS).timestamp(UPDATED_TIMESTAMP);

        restStoreAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreAlert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStoreAlert))
            )
            .andExpect(status().isOk());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
        StoreAlert testStoreAlert = storeAlertList.get(storeAlertList.size() - 1);
        assertThat(testStoreAlert.getStoreName()).isEqualTo(UPDATED_STORE_NAME);
        assertThat(testStoreAlert.getStoreStatus()).isEqualTo(UPDATED_STORE_STATUS);
        assertThat(testStoreAlert.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateStoreAlertWithPatch() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();

        // Update the storeAlert using partial update
        StoreAlert partialUpdatedStoreAlert = new StoreAlert();
        partialUpdatedStoreAlert.setId(storeAlert.getId());

        partialUpdatedStoreAlert.storeName(UPDATED_STORE_NAME).storeStatus(UPDATED_STORE_STATUS).timestamp(UPDATED_TIMESTAMP);

        restStoreAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreAlert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStoreAlert))
            )
            .andExpect(status().isOk());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
        StoreAlert testStoreAlert = storeAlertList.get(storeAlertList.size() - 1);
        assertThat(testStoreAlert.getStoreName()).isEqualTo(UPDATED_STORE_NAME);
        assertThat(testStoreAlert.getStoreStatus()).isEqualTo(UPDATED_STORE_STATUS);
        assertThat(testStoreAlert.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, storeAlert.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStoreAlert() throws Exception {
        int databaseSizeBeforeUpdate = storeAlertRepository.findAll().size();
        storeAlert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreAlertMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(storeAlert))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreAlert in the database
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStoreAlert() throws Exception {
        // Initialize the database
        storeAlertRepository.saveAndFlush(storeAlert);

        int databaseSizeBeforeDelete = storeAlertRepository.findAll().size();

        // Delete the storeAlert
        restStoreAlertMockMvc
            .perform(delete(ENTITY_API_URL_ID, storeAlert.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StoreAlert> storeAlertList = storeAlertRepository.findAll();
        assertThat(storeAlertList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
