package com.okta.developer.store.config;

import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;

public interface KafkaStoreAlertProducer {
    String CHANNELNAME = "binding-out-store-alert";

    @Output(CHANNELNAME)
    MessageChannel output();
}
