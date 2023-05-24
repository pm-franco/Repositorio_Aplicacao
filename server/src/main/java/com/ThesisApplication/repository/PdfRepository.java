package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.PdfDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PdfRepository extends JpaRepository<PdfDAO, Integer> {

    List<PdfDAO> findByArtworkId(int artworkId);
}
