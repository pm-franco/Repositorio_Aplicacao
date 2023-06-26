package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.LayerDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LayerRepository extends JpaRepository<LayerDTO, Integer> {

    List<LayerDTO> findByArtworkIdOrderByDepthAsc(int artworkId);

}
