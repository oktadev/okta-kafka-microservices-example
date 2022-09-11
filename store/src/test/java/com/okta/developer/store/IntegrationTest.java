package com.okta.developer.store;

import com.okta.developer.store.StoreApp;
import com.okta.developer.store.config.AsyncSyncConfiguration;
import com.okta.developer.store.config.EmbeddedKafka;
import com.okta.developer.store.config.EmbeddedMongo;
import com.okta.developer.store.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { StoreApp.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
@EmbeddedMongo
@EmbeddedKafka
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public @interface IntegrationTest {
}
