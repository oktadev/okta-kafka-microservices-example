package com.okta.developer.store.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.okta.developer.store.IntegrationTest;
import com.okta.developer.store.domain.Store;
import com.okta.developer.store.domain.enumeration.StoreStatus;
import com.okta.developer.store.repository.StoreRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link StoreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StoreResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final StoreStatus DEFAULT_STATUS = StoreStatus.OPEN;
    private static final StoreStatus UPDATED_STATUS = StoreStatus.CLOSED;

    private static final Instant DEFAULT_CREATE_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATE_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATE_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATE_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/stores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private MockMvc restStoreMockMvc;

    private Store store;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createEntity() {
        Store store = new Store()
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS)
            .status(DEFAULT_STATUS)
            .createTimestamp(DEFAULT_CREATE_TIMESTAMP)
            .updateTimestamp(DEFAULT_UPDATE_TIMESTAMP);
        return store;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createUpdatedEntity() {
        Store store = new Store()
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .status(UPDATED_STATUS)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP)
            .updateTimestamp(UPDATED_UPDATE_TIMESTAMP);
        return store;
    }

    @BeforeEach
    public void initTest() {
        storeRepository.deleteAll();
        store = createEntity();
    }

    @Test
    void createStore() throws Exception {
        int databaseSizeBeforeCreate = storeRepository.findAll().size();
        // Create the Store
        restStoreMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isCreated());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeCreate + 1);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStore.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testStore.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testStore.getCreateTimestamp()).isEqualTo(DEFAULT_CREATE_TIMESTAMP);
        assertThat(testStore.getUpdateTimestamp()).isEqualTo(DEFAULT_UPDATE_TIMESTAMP);
    }

    @Test
    void createStoreWithExistingId() throws Exception {
        // Create the Store with an existing ID
        store.setId("existing_id");

        int databaseSizeBeforeCreate = storeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setName(null);

        // Create the Store, which fails.

        restStoreMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setAddress(null);

        // Create the Store, which fails.

        restStoreMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCreateTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = storeRepository.findAll().size();
        // set the field null
        store.setCreateTimestamp(null);

        // Create the Store, which fails.

        restStoreMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllStores() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        // Get all the storeList
        restStoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(store.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createTimestamp").value(hasItem(DEFAULT_CREATE_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].updateTimestamp").value(hasItem(DEFAULT_UPDATE_TIMESTAMP.toString())));
    }

    @Test
    void getStore() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        // Get the store
        restStoreMockMvc
            .perform(get(ENTITY_API_URL_ID, store.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(store.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createTimestamp").value(DEFAULT_CREATE_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.updateTimestamp").value(DEFAULT_UPDATE_TIMESTAMP.toString()));
    }

    @Test
    void getNonExistingStore() throws Exception {
        // Get the store
        restStoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewStore() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store
        Store updatedStore = storeRepository.findById(store.getId()).get();
        updatedStore
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .status(UPDATED_STATUS)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP)
            .updateTimestamp(UPDATED_UPDATE_TIMESTAMP);

        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStore.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStore.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStore.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testStore.getCreateTimestamp()).isEqualTo(UPDATED_CREATE_TIMESTAMP);
        assertThat(testStore.getUpdateTimestamp()).isEqualTo(UPDATED_UPDATE_TIMESTAMP);
    }

    @Test
    void putNonExistingStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, store.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore.address(UPDATED_ADDRESS);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStore.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStore.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testStore.getCreateTimestamp()).isEqualTo(DEFAULT_CREATE_TIMESTAMP);
        assertThat(testStore.getUpdateTimestamp()).isEqualTo(DEFAULT_UPDATE_TIMESTAMP);
    }

    @Test
    void fullUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        int databaseSizeBeforeUpdate = storeRepository.findAll().size();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .status(UPDATED_STATUS)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP)
            .updateTimestamp(UPDATED_UPDATE_TIMESTAMP);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
        Store testStore = storeList.get(storeList.size() - 1);
        assertThat(testStore.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStore.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testStore.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testStore.getCreateTimestamp()).isEqualTo(UPDATED_CREATE_TIMESTAMP);
        assertThat(testStore.getUpdateTimestamp()).isEqualTo(UPDATED_UPDATE_TIMESTAMP);
    }

    @Test
    void patchNonExistingStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, store.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamStore() throws Exception {
        int databaseSizeBeforeUpdate = storeRepository.findAll().size();
        store.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(store))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteStore() throws Exception {
        // Initialize the database
        storeRepository.save(store);

        int databaseSizeBeforeDelete = storeRepository.findAll().size();

        // Delete the store
        restStoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, store.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Store> storeList = storeRepository.findAll();
        assertThat(storeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
