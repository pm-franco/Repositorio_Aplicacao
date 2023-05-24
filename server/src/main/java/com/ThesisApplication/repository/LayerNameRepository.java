package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.LayerNameDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LayerNameRepository extends JpaRepository<LayerNameDAO, String> {

}
