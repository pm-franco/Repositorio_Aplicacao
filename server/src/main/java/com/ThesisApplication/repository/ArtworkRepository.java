package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.ArtworkDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ArtworkRepository extends JpaRepository<ArtworkDTO, Integer> {

    List<ArtworkDTO> findAllByOrderByIdAsc();
    List<ArtworkDTO> findByName(String name);

    List<ArtworkDTO> findByInsertedBy(String email);
}
