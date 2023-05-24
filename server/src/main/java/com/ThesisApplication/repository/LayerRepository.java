package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.LayerDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LayerRepository extends JpaRepository<LayerDAO, Integer> {

    List<LayerDAO> findByArtworkIdOrderByDepthAsc(int artworkId);

}
