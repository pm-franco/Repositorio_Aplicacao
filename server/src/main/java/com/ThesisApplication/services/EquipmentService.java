package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.EquipmentDAO;
import com.ThesisApplication.repository.EquipmentRepository;
import com.ThesisApplication.repository.ZoomPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private ZoomPointRepository zoomPointRepository;

    @Autowired
    private UserService userService;

    public ResponseEntity<String> postEquipment(EquipmentDAO equipment) {
        if (equipment == null || equipment.getZoomPointId() <= 0 || equipment.getName() == null || equipment.getName().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        if (!zoomPointRepository.existsById(equipment.getZoomPointId()))
            return ResponseEntity.badRequest().body("Point does not exist.");
        ResponseEntity response = userService.checkRole(equipment.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            equipmentRepository.save(new EquipmentDAO(equipment.getId(), equipment.getZoomPointId(), equipment.getName(), equipment.getCharacteristics(), equipment.getLicenses()));
            return ResponseEntity.status(201).body("Equipment created for Point Info with id: " + equipment.getZoomPointId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    public ResponseEntity getEquipmentByPointId(int id) {

        List<EquipmentDAO> equipList = equipmentRepository.findByZoomPointId(id);
        if (equipList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(equipList);
    }


    public ResponseEntity getEquipmentById(int id) {

        Optional<EquipmentDAO> equipData = equipmentRepository.findById(id);

        if (equipData.isPresent()) {
            return ResponseEntity.ok().body(equipData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity editEquipment(int id, EquipmentDAO equipmentNewData) {
        if (equipmentNewData == null || equipmentNewData.getZoomPointId() <= 0 || equipmentNewData.getName() == null || equipmentNewData.getName().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        if (!zoomPointRepository.existsById(equipmentNewData.getZoomPointId()))
            return ResponseEntity.badRequest().body("Point does not exist.");
        ResponseEntity response = userService.checkRole(equipmentNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        EquipmentDAO equipment = getEquipmentIfExists(id);

        if (equipment == null)
            return ResponseEntity.badRequest().body("Equipment does not exist");

        try {
            equipment.setName(equipmentNewData.getName());
            equipment.setCharacteristics(equipmentNewData.getCharacteristics());
            equipment.setLicenses(equipmentNewData.getLicenses());

            final EquipmentDAO updatedEquipment = equipmentRepository.save(equipment);
            return ResponseEntity.ok(updatedEquipment);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity deleteEquipment(EquipmentDAO equipment){
        if(!equipmentRepository.existsById(equipment.getId()))
            return ResponseEntity.badRequest().body("Equipment does not exist with such id.");
        ResponseEntity response = userService.checkRole(equipment.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            equipmentRepository.deleteById(equipment.getId());
            return ResponseEntity.status(200).body("Equipment deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public void deleteEquipmentByZoomPointId(int id){
        List<EquipmentDAO> equipList = equipmentRepository.findByZoomPointId(id);
        if (!equipList.isEmpty()){
            equipmentRepository.deleteAll(equipList);
        }
    }

    private EquipmentDAO getEquipmentIfExists(int id) {
        return equipmentRepository.findById(id).orElse(null);
    }
}
