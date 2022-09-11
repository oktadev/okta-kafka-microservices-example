package com.okta.developer.alert.config;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.MessageChannel;

public interface KafkaStoreAlertConsumer {
    String CHANNELNAME = "binding-in-store-alert";

    @Input(CHANNELNAME)
    MessageChannel input();
}
