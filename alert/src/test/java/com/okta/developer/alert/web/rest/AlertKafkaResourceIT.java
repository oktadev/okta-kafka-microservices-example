package com.okta.developer.alert.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.okta.developer.alert.IntegrationTest;
import com.okta.developer.alert.config.EmbeddedKafka;
import com.okta.developer.alert.config.KafkaSseConsumer;
import com.okta.developer.alert.config.KafkaSseProducer;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.cloud.stream.test.binder.MessageCollector;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.MimeTypeUtils;

@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
@EmbeddedKafka
class AlertKafkaResourceIT {

    @Autowired
    private MessageCollector collector;

    @Autowired
    private MockMvc restMockMvc;

    @Autowired
    @Qualifier(KafkaSseProducer.CHANNELNAME)
    private MessageChannel output;

    @Autowired
    @Qualifier(KafkaSseConsumer.CHANNELNAME)
    private MessageChannel input;

    @Test
    void producesMessages() throws Exception {
        restMockMvc.perform(post("/api/alert-kafka/publish?message=value-produce")).andExpect(status().isOk());
        BlockingQueue<Message<?>> messages = collector.forChannel(output);
        GenericMessage<String> payload = (GenericMessage<String>) messages.take();
        assertThat(payload.getPayload()).isEqualTo("value-produce");
    }

    @Test
    void consumesMessages() throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.TEXT_PLAIN_VALUE);
        MessageHeaders headers = new MessageHeaders(map);
        Message<String> testMessage = new GenericMessage<>("value-consume", headers);
        MvcResult mvcResult = restMockMvc
            .perform(get("/api/alert-kafka/register"))
            .andExpect(status().isOk())
            .andExpect(request().asyncStarted())
            .andReturn();
        for (int i = 0; i < 100; i++) {
            input.send(testMessage);
            Thread.sleep(100);
            String content = mvcResult.getResponse().getContentAsString();
            if (content.contains("data:value-consume")) {
                restMockMvc.perform(get("/api/alert-kafka/unregister"));
                return;
            }
        }
        fail("Expected content data:value-consume not received");
    }
}
