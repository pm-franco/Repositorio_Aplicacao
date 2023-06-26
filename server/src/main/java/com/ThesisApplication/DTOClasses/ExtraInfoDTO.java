package com.ThesisApplication.DTOClasses;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "extra_info")
@TypeDef(name = "list-array", typeClass = ListArrayType.class)
public class ExtraInfoDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "d")
    @SequenceGenerator(name = "d", sequenceName = "extra_info_extra_id_seq", allocationSize = 1)
    @Column(name = "extra_id")
    private int id;

    @Column(name = "artwork_id", nullable = false)
    private int artworkId;

    @Type(type = "list-array")
    @Column(
            name = "links",
            columnDefinition = "text[]"
    )
    private List<String> links;

    @Type(type = "list-array")
    @Column(
            name = "info",
            columnDefinition = "text[]"
    )
    private List<String> info;

    @Transient
    private String user;

    public ExtraInfoDTO(){}

    public ExtraInfoDTO(int id, int artworkId) {
        this.id = id;
        this.artworkId = artworkId;
    }

    public ExtraInfoDTO(int id, int artworkId, List<String> links, List<String> info) {
        this.id = id;
        this.artworkId = artworkId;
        this.links = links;
        this.info = info;
    }

    public ExtraInfoDTO(int artworkId, List<String> links, List<String> info) {
        this.artworkId = artworkId;
        this.links = links;
        this.info = info;
    }

    public ExtraInfoDTO(int artworkId, List<String> links, List<String> info, String user) {
        this.artworkId = artworkId;
        this.links = links;
        this.info = info;
        this.user = user;
    }

    public ExtraInfoDTO(int id, String user) {
        this.id = id;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArtworkId() {
        return artworkId;
    }

    public void setArtworkId(int artworkId) {
        this.artworkId = artworkId;
    }

    public List<String> getLinks() {
        return links;
    }

    public void setLinks(List<String> links) {
        this.links = links;
    }

    public List<String> getInfo() {
        return info;
    }

    public void setInfo(List<String> info) {
        this.info = info;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
