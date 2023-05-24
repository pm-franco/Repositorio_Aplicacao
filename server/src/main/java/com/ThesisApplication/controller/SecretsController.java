package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.SecretsDAO;
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
    public ResponseEntity<String> postSecret(@RequestBody SecretsDAO secretsDAO) {
        return secretsService.postSecret(secretsDAO);
    }

    @GetMapping(path = "/{type}")
    public ResponseEntity secretByType(@PathVariable String type) {
       return secretsService.secretByType(type);
    }

    @PostMapping(path = "/match")
    public ResponseEntity matchSecret(@RequestBody SecretsDAO secretsDAO){
        return secretsService.matchSecret(secretsDAO);
    }

    @GetMapping("/all")
    public ResponseEntity getAllSecrets() {
        return secretsService.getAllSecrets();
    }

    @PutMapping(path = "/")
    public ResponseEntity updateSecret(@RequestBody SecretsDAO secret) {
        return secretsService.updateSecret(secret);
    }
}
