package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.ArtworkDTO;
import com.ThesisApplication.services.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/test")
public class Test {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping(path = "/")
    public ResponseEntity HelloWorld() {
        return ResponseEntity.ok().body("Hello World.");
    }

    @GetMapping("/all")
    public ResponseEntity<List<ArtworkDTO>> getAllArtworks() {
        return artworkService.getAllArtworks();
    }

    @PostMapping(path = "/")
    public ResponseEntity<String> Test(){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "123";
        String encoded = encoder.encode(raw);
        return ResponseEntity.ok(encoded);
    }

}
