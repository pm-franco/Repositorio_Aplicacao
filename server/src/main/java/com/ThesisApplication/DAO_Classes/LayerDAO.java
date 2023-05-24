package com.ThesisApplication.DAO_Classes;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
@Entity
@Table(name = "layers")
@EntityListeners(AuditingEntityListener.class)
@TypeDef(name = "list-array", typeClass = ListArrayType.class)
public class LayerDAO {

        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ab")
        @SequenceGenerator(name = "ab", sequenceName = "layers_layer_id_seq", allocationSize = 1)
        @Column(name = "layer_id", nullable = false)
        private int id;

        @Column(name = "layer_name", nullable = false)
        private String layerName;

        @Lob
        @Column(name = "image", nullable = false)
        @Type(type = "org.hibernate.type.BinaryType")
        private byte[] image;

        @Column(name = "depth", nullable = false)
        private int depth;

        @Column(name = "artwork_id", nullable = false)
        private int artworkId;

        @Transient
        private String user;

        public LayerDAO() {}

        public LayerDAO(int id, String layerName, byte[] image, int depth, int artworkId) {
                this.id = id;
                this.layerName = layerName;
                this.image = image;
                this.depth = depth;
                this.artworkId = artworkId;
        }

        public LayerDAO(int id, String layerName, byte[] image, int depth, int artworkId, String user) {
                this.id = id;
                this.layerName = layerName;
                this.image = image;
                this.depth = depth;
                this.artworkId = artworkId;
                this.user = user;
        }

        public LayerDAO(int id, String user) {
                this.id = id;
                this.user = user;
        }

        public LayerDAO(String layerName, int depth, int artworkId, String user) {
                this.layerName = layerName;
                this.depth = depth;
                this.artworkId = artworkId;
                this.user = user;
        }

        public int getId() {
                return id;
        }

        public void setId(int id) {
                this.id = id;
        }

        public String getLayerName() {
                return layerName;
        }

        public void setLayerName(String layerName) {
                this.layerName = layerName;
        }

        public byte[] getImage() {
                return image;
        }

        public void setImage(byte[] image) {
                this.image = image;
        }

        public int getDepth() {
                return depth;
        }

        public void setDepth(int depth) {
                this.depth = depth;
        }

        public int getArtworkId() {
                return artworkId;
        }

        public void setArtworkId(int artworkId) {
                this.artworkId = artworkId;
        }

        public String getUser() {
                return user;
        }

        public void setUser(String user) {
                this.user = user;
        }
}
