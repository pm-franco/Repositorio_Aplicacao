package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.LayerNameDAO;
import com.ThesisApplication.services.LayerNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/layer")
@CrossOrigin(origins = "http://localhost:3000")
public class LayerNameController {

    @Autowired
    private LayerNameService layerNameService;

    @PostMapping(path= "/")
    public ResponseEntity<String> postLayerName(@RequestBody LayerNameDAO layerName){
        return layerNameService.postLayerName(layerName);
    }

    @DeleteMapping(path= "/")
    public ResponseEntity deleteLayerName(@RequestBody LayerNameDAO layer){
        return layerNameService.deleteLayerName(layer);
    }

    @GetMapping("/all")
    public ResponseEntity getAllLayers() {
        return layerNameService.getAllLayers();
    }
}
