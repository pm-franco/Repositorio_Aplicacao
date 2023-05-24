package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.ExtraInfoDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExtraInfoRepository extends JpaRepository<ExtraInfoDAO, Integer> {

    List<ExtraInfoDAO> findByArtworkId(int artworkId);
}
