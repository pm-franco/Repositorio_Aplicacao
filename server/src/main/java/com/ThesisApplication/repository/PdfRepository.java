package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.PdfDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PdfRepository extends JpaRepository<PdfDTO, Integer> {

    List<PdfDTO> findByArtworkId(int artworkId);
}
