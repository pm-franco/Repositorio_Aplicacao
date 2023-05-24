package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.ZoomPointDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoomPointRepository extends JpaRepository<ZoomPointDAO, Integer> {

    List<ZoomPointDAO> findByArtworkId(int artworkId);

    List<ZoomPointDAO> findByLayerName(String layer);

    List<ZoomPointDAO> findByZoomPointId(int zoomPointId);
}
