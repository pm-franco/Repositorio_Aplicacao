package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.*;
import com.ThesisApplication.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @PostMapping(path = "/")
    public ResponseEntity<String> postEquipment(@RequestBody EquipmentDTO equipment) {
        return equipmentService.postEquipment(equipment);
    }

    @GetMapping(path = "/point_id/{id}")
    public ResponseEntity getEquipmentByPointId(@PathVariable int id) {
        return equipmentService.getEquipmentByPointId(id);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getEquipmentById(@PathVariable int id) {
        return equipmentService.getEquipmentById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity editEquipment(@PathVariable int id, @RequestBody EquipmentDTO equipmentNewData) {
        return equipmentService.editEquipment(id, equipmentNewData);
    }

    @DeleteMapping(path = "/")
    public ResponseEntity deleteEquipment(@RequestBody EquipmentDTO equipment){
        return equipmentService.deleteEquipment(equipment);
    }
}
