package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.LayerNameDTO;
import com.ThesisApplication.services.LayerNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/layer")

public class LayerNameController {

    @Autowired
    private LayerNameService layerNameService;

    @PostMapping(path= "/")
    public ResponseEntity<String> postLayerName(@RequestBody LayerNameDTO layerName){
        return layerNameService.postLayerName(layerName);
    }

    @DeleteMapping(path= "/")
    public ResponseEntity deleteLayerName(@RequestBody LayerNameDTO layer){
        return layerNameService.deleteLayerName(layer);
    }

    @GetMapping("/all")
    public ResponseEntity getAllLayers() {
        return layerNameService.getAllLayers();
    }
}
