package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.SecretsDTO;
import com.ThesisApplication.services.SecretsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secrets")
@CrossOrigin(origins = "http://localhost:3000")
public class SecretsController {

    @Autowired
    private SecretsService secretsService;

    @PostMapping(path = "/")
    public ResponseEntity<String> postSecret(@RequestBody SecretsDTO secretsDTO) {
        return secretsService.postSecret(secretsDTO);
    }

    @GetMapping(path = "/{type}")
    public ResponseEntity secretByType(@PathVariable String type) {
       return secretsService.secretByType(type);
    }

    @PostMapping(path = "/match")
    public ResponseEntity matchSecret(@RequestBody SecretsDTO secretsDTO){
        return secretsService.matchSecret(secretsDTO);
    }

    @GetMapping("/all")
    public ResponseEntity getAllSecrets() {
        return secretsService.getAllSecrets();
    }

    @PutMapping(path = "/")
    public ResponseEntity updateSecret(@RequestBody SecretsDTO secret) {
        return secretsService.updateSecret(secret);
    }
}
