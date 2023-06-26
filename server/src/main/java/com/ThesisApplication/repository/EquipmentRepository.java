package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.EquipmentDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<EquipmentDTO, Integer> {

    List<EquipmentDTO> findByZoomPointId(int zoomId);
}
