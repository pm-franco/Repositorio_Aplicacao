package com.ThesisApplication.DAO_Classes;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "layer_names")
@EntityListeners(AuditingEntityListener.class)
public class LayerNameDAO {

    @Id
    @Column(name = "layer_name", nullable = false)
    private String layerName;

    @Column(name = "multiple_points", nullable = false)
    private Boolean multiplePoints;

    @Transient
    private String user;

    public LayerNameDAO(){}

    public LayerNameDAO(String layerName) {
        this.layerName = layerName;
    }

    public LayerNameDAO(String layerName, Boolean multiplePoints) {
        this.layerName = layerName;
        this.multiplePoints = multiplePoints;
    }

    public LayerNameDAO(String layerName, String user) {
        this.layerName = layerName;
        this.user = user;
    }

    public LayerNameDAO(String layerName, Boolean multiplePoints, String user) {
        this.layerName = layerName;
        this.multiplePoints = multiplePoints;
        this.user = user;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Boolean getMultiplePoints() {
        return multiplePoints;
    }

    public void setMultiplePoints(Boolean multiplePoints) {
        this.multiplePoints = multiplePoints;
    }
}
