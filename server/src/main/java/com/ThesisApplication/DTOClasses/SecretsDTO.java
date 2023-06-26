package com.ThesisApplication.DTOClasses;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "secrets")
public class SecretsDTO {

    @Id
    @Column(name = "type", nullable = false)
    private String type;
    @Column(name = "value", nullable = false)
    private String value;
    @Transient
    private String newValue;

    @Transient
    private String user;

    public SecretsDTO(){}

    public SecretsDTO(String type, String value) {
        this.type = type;
        this.value = value;
    }

    public SecretsDTO(String type, String value, String user) {
        this.type = type;
        this.value = value;
        this.user = user;
    }

    public SecretsDTO(String type, String value, String newValue, String user) {
        this.type = type;
        this.value = value;
        this.newValue = newValue;
        this.user = user;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
