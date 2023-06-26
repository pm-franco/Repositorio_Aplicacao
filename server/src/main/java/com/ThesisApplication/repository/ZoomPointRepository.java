package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.ZoomPointDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoomPointRepository extends JpaRepository<ZoomPointDTO, Integer> {

    List<ZoomPointDTO> findByArtworkId(int artworkId);

    List<ZoomPointDTO> findByLayerName(String layer);

    List<ZoomPointDTO> findByZoomPointId(int zoomPointId);
}
