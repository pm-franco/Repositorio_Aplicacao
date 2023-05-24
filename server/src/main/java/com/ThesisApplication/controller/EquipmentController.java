package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.*;
import com.ThesisApplication.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @PostMapping(path = "/")
    public ResponseEntity<String> postEquipment(@RequestBody EquipmentDAO equipment) {
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
    public ResponseEntity editEquipment(@PathVariable int id, @RequestBody EquipmentDAO equipmentNewData) {
        return equipmentService.editEquipment(id, equipmentNewData);
    }

    @DeleteMapping(path = "/")
    public ResponseEntity deleteEquipment(@RequestBody EquipmentDAO equipment){
        return equipmentService.deleteEquipment(equipment);
    }
}
