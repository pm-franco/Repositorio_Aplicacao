package com.ThesisApplication.DAO_Classes;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "equipment")
@EntityListeners(AuditingEntityListener.class)
@TypeDef(name = "list-array", typeClass = ListArrayType.class)
public class EquipmentDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "b")
    @SequenceGenerator(name = "b", sequenceName = "equipment_equip_id_seq", allocationSize = 1)
    @Column(name = "equip_id")
    private int id;

    @Column(name = "zoom_point_id", nullable = false)
    private int zoomPointId;

    @Column(name = "name", nullable = false)
    private String name;

    @Type(type = "list-array")
    @Column(
            name = "characteristics",
            columnDefinition = "text[]"
    )
    private List<String> characteristics;

    @Type(type = "list-array")
    @Column(
            name = "licenses",
            columnDefinition = "text[]"
    )
    private List<String> licenses;

    @Transient
    private String user;

    public EquipmentDAO() {}

    public EquipmentDAO(int id, int zoomPointId, String name, List<String> characteristics, List<String> licenses) {
        this.id = id;
        this.zoomPointId = zoomPointId;
        this.name = name;
        this.characteristics = characteristics;
        this.licenses = licenses;
    }

    public EquipmentDAO(int zoomPointId, String name, List<String> characteristics, List<String> licenses) {
        this.zoomPointId = zoomPointId;
        this.name = name;
        this.characteristics = characteristics;
        this.licenses = licenses;
    }

    public EquipmentDAO(int zoomPointId, String name, List<String> characteristics, List<String> licenses, String user) {
        this.zoomPointId = zoomPointId;
        this.name = name;
        this.characteristics = characteristics;
        this.licenses = licenses;
        this.user = user;
    }

    public EquipmentDAO(int id, String user) {
        this.id = id;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getZoomPointId() {
        return zoomPointId;
    }

    public void setZoomPointId(int zoomPointId) {
        this.zoomPointId = zoomPointId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(List<String> characteristics) {
        this.characteristics = characteristics;
    }

    public List<String> getLicenses() {
        return licenses;
    }

    public void setLicenses(List<String> licenses) {
        this.licenses = licenses;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
