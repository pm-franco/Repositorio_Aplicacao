package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.ArtworkDAO;
import com.ThesisApplication.services.ArtworkService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/artwork")
@CrossOrigin(origins = "http://localhost:3000")
public class ArtworkController {

    @Autowired
     private ArtworkService artworkService;

    static final Gson g = new Gson();

    @PostMapping(path = "/")
    public ResponseEntity<String> postArtwork(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        ArtworkDAO artwork = g.fromJson(jsonObject, ArtworkDAO.class);
        return artworkService.postArtwork(file, artwork);
    }

    @GetMapping(path = "/name/{name}")
    public ResponseEntity getByName(@PathVariable String name) {
        return artworkService.getByName(name);
    }

    @GetMapping(path = "/user/{email}")
    public ResponseEntity getByUser(@PathVariable String email) {
        return artworkService.getByUser(email);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getById(@PathVariable int id) {
        return artworkService.getById(id);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArtworkDAO>> getAllArtworks() {
        return artworkService.getAllArtworks();
    }

    @PutMapping("/{id}")
    public ResponseEntity editArtworkSameFile(@PathVariable int id, @RequestBody ArtworkDAO artworkNewData) {
        return artworkService.editArtworkSameFile(id, artworkNewData);
    }

    @PutMapping("/file/{id}")
    public ResponseEntity editArtworkNewFile(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject, @PathVariable int id) {
        ArtworkDAO artworkNewData = g.fromJson(jsonObject, ArtworkDAO.class);
        return artworkService.editArtworkNewFile(file, artworkNewData, id);
    }

    @DeleteMapping("/")
    public ResponseEntity deleteArtwork(@RequestBody ArtworkDAO artwork){
        return artworkService.deleteArtwork(artwork);
    }
}
