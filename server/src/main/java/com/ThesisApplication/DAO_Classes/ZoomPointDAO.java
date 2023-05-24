package com.ThesisApplication.DAO_Classes;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "zoom_point")
@EntityListeners(AuditingEntityListener.class)
@TypeDef(name = "list-array", typeClass = ListArrayType.class)
public class ZoomPointDAO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "c")
    @SequenceGenerator(name = "c", sequenceName = "zoom_point_zoom_id_seq", allocationSize = 1)
    @Column(name = "zoom_id")
    private int id;

    @Column(name = "artwork_id", nullable = false)
    private int artworkId;

    @Column(name = "position_x", nullable = false)
    private double positionX;
    @Column(name = "position_y", nullable = false)
    private double positionY;
    @Column(name = "file_size")
    private float fileSize;
    @Column(name = "metric_width", nullable = false)
    private float metricWidth;

    @Column(name = "metric_height", nullable = false)
    private float metricHeight;
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "layer_name", nullable = false)
    private String layerName;

    @Column(name = "author", nullable = false)
    private String  author;

    @Column(name = "technique")
    private String technique;

    @Lob
    @Column(name = "image")
    @Type(type = "org.hibernate.type.BinaryType")
    private byte[] image;
    @Column(name = "date")
    private Date date;

    @Type(type = "list-array")
    @Column(name = "copyrights", columnDefinition = "text[]")
    private List<String> copyrights;

    @Type(type = "list-array")
    @Column(name = "materials", columnDefinition = "text[]")
    private List<String> materials;
    @Column(name = "zoom_point_id")
    private int zoomPointId;

    @Column(name = "pixel_width", nullable = false)
    private double pixelWidth;
    @Column(name = "pixel_height", nullable = false)
    private double pixelHeight;

    @Transient
    private String user;


    public ZoomPointDAO(){}

    public ZoomPointDAO(int id, String name, String layerName, String author, byte[] image, double positionX, double positionY) {
        this.id = id;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.image = image;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    public ZoomPointDAO(int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, Date date, List<String> copyrights, List<String> materials, String user, int zoomPointId, double pixelWidth, double pixelHeight) {
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
        this.user = user;
        this.zoomPointId = zoomPointId;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ZoomPointDAO(int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, Date date, List<String> copyrights, List<String> materials, String user) {
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
        this.user = user;
    }

    public ZoomPointDAO(int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, Date date, List<String> copyrights, List<String> materials) {
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
    }

    public ZoomPointDAO(float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, byte[] image, Date date, List<String> copyrights, List<String> materials) {
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.image = image;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
    }

    public ZoomPointDAO(int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, byte[] image, Date date, List<String> copyrights, List<String> materials) {
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.image = image;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
    }

    public ZoomPointDAO(int id, int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, byte[] image, Date date, List<String> copyrights, List<String> materials) {
        this.id = id;
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.image = image;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
    }

    public ZoomPointDAO(int id, int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, byte[] image, Date date, List<String> copyrights, List<String> materials, int zoomPointId) {
        this.id = id;
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.image = image;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
        this.zoomPointId = zoomPointId;
    }

    public ZoomPointDAO(int id, int artworkId, double positionX, double positionY, float fileSize, float metricWidth, float metricHeight, String name, String layerName, String author, String technique, byte[] image, Date date, List<String> copyrights, List<String> materials, int zoomPointId, double pixelWidth, double pixelHeight) {
        this.id = id;
        this.artworkId = artworkId;
        this.positionX = positionX;
        this.positionY = positionY;
        this.fileSize = fileSize;
        this.metricWidth = metricWidth;
        this.metricHeight = metricHeight;
        this.name = name;
        this.layerName = layerName;
        this.author = author;
        this.technique = technique;
        this.image = image;
        this.date = date;
        this.copyrights = copyrights;
        this.materials = materials;
        this.zoomPointId = zoomPointId;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
    }

    public ZoomPointDAO(int id, String user) {
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

    public double getPositionX() {
        return positionX;
    }

    public void setPositionX(double positionX) {
        this.positionX = positionX;
    }

    public double getPositionY() {
        return positionY;
    }

    public void setPositionY(double positionY) {
        this.positionY = positionY;
    }

    public float getFileSize() {
        return fileSize;
    }

    public void setFileSize(float fileSize) {
        this.fileSize = fileSize;
    }

    public float getMetricWidth() {
        return metricWidth;
    }

    public void setMetricWidth(float metricWidth) {
        this.metricWidth = metricWidth;
    }

    public float getMetricHeight() {
        return metricHeight;
    }

    public void setMetricHeight(float metricHeight) {
        this.metricHeight = metricHeight;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTechnique() {
        return technique;
    }

    public void setTechnique(String technique) {
        this.technique = technique;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<String> getCopyrights() {
        return copyrights;
    }

    public void setCopyrights(List<String> copyrights) {
        this.copyrights = copyrights;
    }

    public List<String> getMaterials() {
        return materials;
    }

    public void setMaterials(List<String> materials) {
        this.materials = materials;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public int getZoomPointId() {
        return zoomPointId;
    }

    public void setZoomPointId(int zoomPointId) {
        this.zoomPointId = zoomPointId;
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
}
