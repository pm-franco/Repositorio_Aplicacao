package com.ThesisApplication.DAO_Classes;

import org.hibernate.annotations.Type;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Table(name = "pdf")
@EntityListeners(AuditingEntityListener.class)
public class PdfDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "e")
    @SequenceGenerator(name = "e", sequenceName = "pdf_pdf_id_seq", allocationSize = 1)
    @Column(name = "pdf_id")
    private int id;

    @Column(name = "artwork_id", nullable = false)
    private int artworkId;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "file")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] file;

    @Column(name = "link")
    private String link;

    @Transient
    private String user;

    public PdfDAO() {
    }

    public PdfDAO(int id, int artworkId, String name, byte[] file, String link) {
        this.id = id;
        this.artworkId = artworkId;
        this.name = name;
        this.file = file;
        this.link = link;
    }

    public PdfDAO(int artworkId, String name, String link) {
        this.artworkId = artworkId;
        this.name = name;
        this.link = link;
    }

    public PdfDAO(int artworkId, String name, String link, String user) {
        this.artworkId = artworkId;
        this.name = name;
        this.link = link;
        this.user = user;
    }

    public PdfDAO(int id, String user) {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] image) {
        this.file = image;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
