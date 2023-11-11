package com.ThesisApplication.controller;


import com.ThesisApplication.DTOClasses.ZoomPointDTO;
import com.ThesisApplication.services.ZoomPointService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/zoom_point")
public class ZoomPointController {

    @Autowired
    private ZoomPointService zoomPointService;

    static final Gson g = new Gson();

    @PostMapping(path = "/")
    public ResponseEntity postZoomPoint(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        ZoomPointDTO zoomPoint = g.fromJson(jsonObject, ZoomPointDTO.class);
        return zoomPointService.postZoomPoint(file, zoomPoint);
    }

    @GetMapping(path = "/artwork_id/{id}")
    public ResponseEntity<List<ZoomPointDTO>> getByArtworkId(@PathVariable int id) {
        return zoomPointService.getByArtworkId(id);
    }

    @GetMapping(path = "/zoom_point_id/{id}")
    public ResponseEntity<List<ZoomPointDTO>> getByZoomPointId(@PathVariable int id) {
        return zoomPointService.getByZoomPointId(id);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getById(@PathVariable int id) {
        return zoomPointService.getById(id);
    }

    @PutMapping("/file/{id}")
    public ResponseEntity editZoomPointNewFile(@PathVariable int id, @RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        ZoomPointDTO zoomPointNewData = g.fromJson(jsonObject, ZoomPointDTO.class);
        return zoomPointService.editZoomPointNewFile(id,file, zoomPointNewData);
    }

    @PutMapping("/{id}")
    public ResponseEntity editZoomPointSameFile(@PathVariable int id, @RequestBody ZoomPointDTO zoomPointNewData) {
        return zoomPointService.editZoomPointSameFile(id, zoomPointNewData);
    }

    @DeleteMapping("/")
    public ResponseEntity deletePoint(@RequestBody ZoomPointDTO zoomPoint){
        return zoomPointService.deletePoint(zoomPoint);
    }
}
