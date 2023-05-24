package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.ArtworkDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtworkRepository extends JpaRepository<ArtworkDAO, Integer> {

    List<ArtworkDAO> findAllByOrderByIdAsc();
    List<ArtworkDAO> findByName(String name);

    List<ArtworkDAO> findByInsertedBy(String email);
}
