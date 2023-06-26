package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.LayerNameDTO;
import com.ThesisApplication.repository.LayerNameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class LayerNameService {

    @Autowired
    private LayerNameRepository layerNameRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ZoomPointService zoomPointService;

    public ResponseEntity<String> postLayerName(LayerNameDTO layerName){
        if(layerName == null || layerName.getLayerName() == null || layerName.getLayerName().equals(""))
            return ResponseEntity.badRequest().body("Layer name cannot be null or empty.");
        if (layerNameRepository.existsById(layerName.getLayerName()))
            return ResponseEntity.badRequest().body("Already exists in the system.");
        ResponseEntity response = userService.checkRole(layerName.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            //layerNameRepository.save(new LayerNameDTO(layerName.getLayerName(), layerName.getMultiplePoints()));
            layerNameRepository.save(layerName);
            return ResponseEntity.status(201).body(layerName.getLayerName() + " has been added.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity deleteLayerName(LayerNameDTO layer){
        ResponseEntity response = userService.checkRole(layer.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        String layerName= layer.getLayerName();
        if (layerNameRepository.existsById(layerName)){
            if(!isLayerNameEmpty(layerName))
                return ResponseEntity.badRequest().body("There are points with this layer name.");
            layerNameRepository.deleteById(layerName);
            return ResponseEntity.ok().body("Layer " + layerName + " has been removed.");
        }
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity getAllLayers() {
        return ResponseEntity.ok().body(layerNameRepository.findAll());
    }

    private boolean isLayerNameEmpty(String layer){
        return zoomPointService.isLayerNameEmpty(layer);
    }


}
