package com.ThesisApplication.controller;


import com.ThesisApplication.DAO_Classes.ZoomPointDAO;
import com.ThesisApplication.services.ZoomPointService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/zoom_point")
@CrossOrigin(origins = "http://localhost:3000")
public class ZoomPointController {

    @Autowired
    private ZoomPointService zoomPointService;

    static final Gson g = new Gson();

    @PostMapping(path = "/")
    public ResponseEntity postZoomPoint(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        ZoomPointDAO zoomPoint = g.fromJson(jsonObject, ZoomPointDAO.class);
        return zoomPointService.postZoomPoint(file, zoomPoint);
    }

    @GetMapping(path = "/artwork_id/{id}")
    public ResponseEntity<List<ZoomPointDAO>> getByArtworkId(@PathVariable int id) {
        return zoomPointService.getByArtworkId(id);
    }

    @GetMapping(path = "/zoom_point_id/{id}")
    public ResponseEntity<List<ZoomPointDAO>> getByZoomPointId(@PathVariable int id) {
        return zoomPointService.getByZoomPointId(id);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getById(@PathVariable int id) {
        return zoomPointService.getById(id);
    }

    @PutMapping("/file/{id}")
    public ResponseEntity editZoomPointNewFile(@PathVariable int id, @RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        ZoomPointDAO zoomPointNewData = g.fromJson(jsonObject, ZoomPointDAO.class);
        return zoomPointService.editZoomPointNewFile(id,file, zoomPointNewData);
    }

    @PutMapping("/{id}")
    public ResponseEntity editZoomPointSameFile(@PathVariable int id, @RequestBody ZoomPointDAO zoomPointNewData) {
        return zoomPointService.editZoomPointSameFile(id, zoomPointNewData);
    }

    @DeleteMapping("/")
    public ResponseEntity deletePoint(@RequestBody ZoomPointDAO zoomPoint){
        return zoomPointService.deletePoint(zoomPoint);
    }
}
