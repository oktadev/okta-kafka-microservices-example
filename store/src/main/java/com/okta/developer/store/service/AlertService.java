package com.okta.developer.store.service;

import com.okta.developer.store.config.KafkaStoreAlertProducer;
import com.okta.developer.store.domain.Store;
import com.okta.developer.store.service.dto.StoreAlertDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;

import java.util.HashMap;
import java.util.Map;

@Service
public class AlertService {

    private final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final MessageChannel output;

    public AlertService(@Qualifier(KafkaStoreAlertProducer.CHANNELNAME) MessageChannel output) {
        this.output = output;
    }

    public void alertStoreStatus(Store store) {
        try {
            StoreAlertDTO storeAlertDTO = new StoreAlertDTO(store);
            log.debug("Request the message : {} to send to store-alert topic ", storeAlertDTO);

            Map<String, Object> map = new HashMap<>();
            map.put(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_JSON);
            MessageHeaders headers = new MessageHeaders(map);
            output.send(new GenericMessage<>(storeAlertDTO, headers));
        } catch (Exception e){
            log.error("Could not send store alert", e);
            throw new AlertServiceException(e);
        }
    }
}
