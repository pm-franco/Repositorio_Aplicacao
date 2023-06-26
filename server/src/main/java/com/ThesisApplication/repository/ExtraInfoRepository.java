package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.ExtraInfoDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExtraInfoRepository extends JpaRepository<ExtraInfoDTO, Integer> {

    List<ExtraInfoDTO> findByArtworkId(int artworkId);
}
