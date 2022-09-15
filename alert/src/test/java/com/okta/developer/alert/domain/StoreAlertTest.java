package com.okta.developer.alert.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.okta.developer.alert.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StoreAlertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StoreAlert.class);
        StoreAlert storeAlert1 = new StoreAlert();
        storeAlert1.setId(1L);
        StoreAlert storeAlert2 = new StoreAlert();
        storeAlert2.setId(storeAlert1.getId());
        assertThat(storeAlert1).isEqualTo(storeAlert2);
        storeAlert2.setId(2L);
        assertThat(storeAlert1).isNotEqualTo(storeAlert2);
        storeAlert1.setId(null);
        assertThat(storeAlert1).isNotEqualTo(storeAlert2);
    }
}
