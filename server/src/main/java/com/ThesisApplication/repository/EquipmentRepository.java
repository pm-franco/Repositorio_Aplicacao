package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.EquipmentDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<EquipmentDAO, Integer> {

    List<EquipmentDAO> findByZoomPointId(int zoomId);
}
