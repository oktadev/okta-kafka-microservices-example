package com.okta.developer.store.config;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.MessageChannel;

public interface KafkaSseConsumer {
    String CHANNELNAME = "binding-in-sse";

    @Input(CHANNELNAME)
    MessageChannel input();
}
