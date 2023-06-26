package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.LayerDTO;
import com.ThesisApplication.services.LayerService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/image_layer")
@CrossOrigin(origins = "http://localhost:3000")
public class LayerController {

    @Autowired
    private LayerService layerService;

    static final Gson g = new Gson();

    @PostMapping(path= "/")
    public ResponseEntity<String> postLayer(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject){
        LayerDTO layer = g.fromJson(jsonObject, LayerDTO.class);
        return layerService.postLayer(file, layer);
    }

    @DeleteMapping(path= "/")
    public ResponseEntity deleteLayer(@RequestBody LayerDTO layer){
        return layerService.deleteLayer(layer);
    }

    @GetMapping(path = "/artwork_id/{id}")
    public ResponseEntity getByArtworkId(@PathVariable int id) {
        return layerService.getByArtworkId(id);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getById(@PathVariable int id) {
        return layerService.getById(id);
    }

    @PutMapping("/file/{id}")
    public ResponseEntity editLayerNewFile(@PathVariable int id, @RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        LayerDTO layerNewData = g.fromJson(jsonObject, LayerDTO.class);
        return layerService.editLayerNewFile(id,file, layerNewData);
    }

    @PutMapping("/{id}")
    public ResponseEntity editLayerSameFile(@PathVariable int id, @RequestBody LayerDTO layerNewData) {
        return layerService.editLayerSameFile(id, layerNewData);
    }
}
