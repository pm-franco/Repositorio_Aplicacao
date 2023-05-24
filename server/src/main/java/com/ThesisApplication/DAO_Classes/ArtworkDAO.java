package com.ThesisApplication.DAO_Classes;

import org.hibernate.annotations.Type;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "artwork")
@EntityListeners(AuditingEntityListener.class)
public class ArtworkDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "a")
    @SequenceGenerator(name = "a", sequenceName = "artwork_artwork_id_seq", allocationSize = 1)
    @Column(name = "artwork_id")
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "image")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] image;

    @Column(name = "author")
    private String author;

    @Column(name = "art_type", nullable = false)
    private String artType;

    @Column(name = "date")
    private Date date;

    @Column(name = "source", nullable = false)
    private String source;

    @Column(name = "inv_number", nullable = false)
    private String invNumber;

    @Column(name = "super_category", nullable = false)
    private String superCategory;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "matter", nullable = false)
    private String matter;

    @Column(name = "width", nullable = false)
    private double width;

    @Column(name = "height", nullable = false)
    private double height;

    @Column(name = "pixel_width", nullable = false)
    private double pixelWidth;
    @Column(name = "pixel_height", nullable = false)
    private double pixelHeight;

    @Column(name = "inserted_by", nullable = false)
    private String insertedBy;

    @Transient
    private String user;

    public ArtworkDAO() {}

    public ArtworkDAO(int id, String name, String author, String artType, String source, String invNumber, String superCategory, String category, String matter, String insertedBy, byte[] image, Date date, double width, double height, double pixelWidth, double pixelHeight) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.source = source;
        this.invNumber = invNumber;
        this.superCategory = superCategory;
        this.category = category;
        this.matter = matter;
        this.insertedBy = insertedBy;
        this.image = image;
        this.date = date;
        this.width = width;
        this.height = height;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ArtworkDAO(String name, String author, String artType, String source, String invNumber, String superCategory, String category, String matter, String insertedBy, Date date, double width, double height, double pixelWidth, double pixelHeight) {
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.source = source;
        this.invNumber = invNumber;
        this.superCategory = superCategory;
        this.category = category;
        this.matter = matter;
        this.insertedBy = insertedBy;
        this.date = date;
        this.width = width;
        this.height = height;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ArtworkDAO(String name, String author, String artType, String source, String invNumber, String superCategory, String category, String matter, Date date, String insertedBy) {
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.date = date;
        this.source = source;
        this.invNumber = invNumber;
        this.superCategory = superCategory;
        this.category = category;
        this.matter = matter;
        this.insertedBy = insertedBy;
    }

    public ArtworkDAO(int id, String name, String author, String artType, byte[] image, double pixelWidth, double pixelHeight) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.image = image;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ArtworkDAO(int id, String name, byte[] image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

    public ArtworkDAO(String name, String author, String artType, String source, String invNumber, String superCategory, String category, String matter, String insertedBy, byte[] image, Date date, double width, double height, double pixelWidth, double pixelHeight) {
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.source = source;
        this.invNumber = invNumber;
        this.superCategory = superCategory;
        this.category = category;
        this.matter = matter;
        this.insertedBy = insertedBy;
        this.image = image;
        this.date = date;
        this.width = width;
        this.height = height;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ArtworkDAO(String name, String author, String artType, Date date, String source, String invNumber, String superCategory, String category, String matter, double width, double height) {
        this.name = name;
        this.author = author;
        this.artType = artType;
        this.date = date;
        this.source = source;
        this.invNumber = invNumber;
        this.superCategory = superCategory;
        this.category = category;
        this.matter = matter;
        this.width = width;
        this.height = height;
    }

    public ArtworkDAO(int id, String user) {
        this.id = id;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getArtType() {
        return artType;
    }

    public void setArtType(String artType) {
        this.artType = artType;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getInvNumber() {
        return invNumber;
    }

    public void setInvNumber(String invNumber) {
        this.invNumber = invNumber;
    }

    public String getSuperCategory() {
        return superCategory;
    }

    public void setSuperCategory(String superCategory) {
        this.superCategory = superCategory;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMatter() {
        return matter;
    }

    public void setMatter(String matter) {
        this.matter = matter;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getInsertedBy() {
        return insertedBy;
    }

    public void setInsertedBy(String insertedBy) {
        this.insertedBy = insertedBy;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getPixelWidth() {
        return pixelWidth;
    }

    public void setPixelWidth(double pixelWidth) {
        this.pixelWidth = pixelWidth;
    }

    public double getPixelHeight() {
        return pixelHeight;
    }

    public void setPixelHeight(double pixelHeight) {
        this.pixelHeight = pixelHeight;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
