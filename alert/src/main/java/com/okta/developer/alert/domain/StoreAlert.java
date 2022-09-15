package com.okta.developer.alert.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StoreAlert.
 */
@Entity
@Table(name = "store_alert")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class StoreAlert implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "store_name", nullable = false)
    private String storeName;

    @NotNull
    @Column(name = "store_status", nullable = false)
    private String storeStatus;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StoreAlert id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStoreName() {
        return this.storeName;
    }

    public StoreAlert storeName(String storeName) {
        this.setStoreName(storeName);
        return this;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getStoreStatus() {
        return this.storeStatus;
    }

    public StoreAlert storeStatus(String storeStatus) {
        this.setStoreStatus(storeStatus);
        return this;
    }

    public void setStoreStatus(String storeStatus) {
        this.storeStatus = storeStatus;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public StoreAlert timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StoreAlert)) {
            return false;
        }
        return id != null && id.equals(((StoreAlert) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StoreAlert{" +
            "id=" + getId() +
            ", storeName='" + getStoreName() + "'" +
            ", storeStatus='" + getStoreStatus() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
