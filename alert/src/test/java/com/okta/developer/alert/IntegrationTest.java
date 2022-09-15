package com.okta.developer.alert;

import com.okta.developer.alert.AlertApp;
import com.okta.developer.alert.config.AsyncSyncConfiguration;
import com.okta.developer.alert.config.EmbeddedKafka;
import com.okta.developer.alert.config.EmbeddedSQL;
import com.okta.developer.alert.config.TestSecurityConfiguration;
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
@SpringBootTest(classes = { AlertApp.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
@EmbeddedKafka
@EmbeddedSQL
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public @interface IntegrationTest {
}
