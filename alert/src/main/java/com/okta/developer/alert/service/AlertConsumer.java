package com.okta.developer.alert.service;

import com.okta.developer.alert.config.KafkaStoreAlertConsumer;
import com.okta.developer.alert.domain.StoreAlert;
import com.okta.developer.alert.repository.StoreAlertRepository;
import com.okta.developer.alert.service.dto.StoreAlertDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

import java.time.Instant;
@Service
public class AlertConsumer {

    private final Logger log = LoggerFactory.getLogger(AlertConsumer.class);

    private StoreAlertRepository storeAlertRepository;

    private EmailService emailService;

    public AlertConsumer(StoreAlertRepository storeAlertRepository, EmailService emailService) {
        this.storeAlertRepository = storeAlertRepository;
        this.emailService = emailService;
    }

    @StreamListener(value = KafkaStoreAlertConsumer.CHANNELNAME, copyHeaders = "false")
    public void consume(Message<StoreAlertDTO> message) {
        StoreAlertDTO dto = message.getPayload();
        log.info("Got message from kafka stream: {} {}", dto.getStoreName(), dto.getStoreStatus());
        try {
            StoreAlert storeAlert = new StoreAlert();
            storeAlert.setStoreName(dto.getStoreName());
            storeAlert.setStoreStatus(dto.getStoreStatus());
            storeAlert.setTimestamp(Instant.now());

            storeAlertRepository.save(storeAlert);
            emailService.sendSimpleMessage(dto);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
