package com.okta.developer.store.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.okta.developer.store.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StoreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Store.class);
        Store store1 = new Store();
        store1.setId("id1");
        Store store2 = new Store();
        store2.setId(store1.getId());
        assertThat(store1).isEqualTo(store2);
        store2.setId("id2");
        assertThat(store1).isNotEqualTo(store2);
        store1.setId(null);
        assertThat(store1).isNotEqualTo(store2);
    }
}
