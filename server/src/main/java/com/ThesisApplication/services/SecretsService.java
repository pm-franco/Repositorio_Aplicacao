package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.SecretsDAO;
import com.ThesisApplication.DAO_Classes.UserDAO;
import com.ThesisApplication.controller.Enums;
import com.ThesisApplication.repository.SecretsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class SecretsService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Autowired
    private SecretsRepository secretsRepository;

    @Autowired
    private UserService userService;

    public ResponseEntity<String> postSecret(SecretsDAO secretsDAO) {
        if (secretsDAO == null || secretsDAO.getType() == null || secretsDAO.getType().equals("") || secretsDAO.getValue() == null || secretsDAO.getValue().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if (secretsRepository.existsById(secretsDAO.getType()))
            return ResponseEntity.badRequest().body(secretsDAO.getType() + " already exists in our system.");
        ResponseEntity response = userService.checkRole(secretsDAO.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            secretsRepository.save(new SecretsDAO(secretsDAO.getType(), encoder.encode(secretsDAO.getValue())));
            return ResponseEntity.status(201).body("Secret added.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity secretByType(String type) {
        if (type == null || type.equals(""))
            return ResponseEntity.badRequest().body("Type cannot be null or empty.");

        Optional<SecretsDAO> secretData = secretsRepository.findById(type);

        if (secretData.isPresent()) {
            return ResponseEntity.ok().body(secretData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity matchSecret(SecretsDAO secretsDAO){
        SecretsDAO secret = getSecretIfExist(secretsDAO.getType());
        if (secret == null)
            return ResponseEntity.badRequest().body(secretsDAO.getType() + " does not exist in our system.");
        ResponseEntity response = userService.checkRole(secretsDAO.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        if (encoder.matches(secretsDAO.getValue(), secret.getValue()))
            return ResponseEntity.ok().body("Match");
        return ResponseEntity.badRequest().body("Wrong password.");
    }

    public ResponseEntity getAllSecrets() {
        return ResponseEntity.ok().body(secretsRepository.findAllByOrderByTypeAsc());
    }

    public ResponseEntity updateSecret(SecretsDAO secret) {
        if (secret == null || secret.getValue() == null || secret.getValue().equals("") || secret.getNewValue() == null || secret.getNewValue().equals(""))
            return ResponseEntity.badRequest().body("Wrong data");
        ResponseEntity response = userService.checkRole(secret.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        SecretsDAO s = getSecretIfExist(secret.getType());

        if (s == null)
            return ResponseEntity.badRequest().body("Secret does not exist.");

        try {
            if (encoder.matches(secret.getValue(), s.getValue())) {
                if (secret.getValue().equals(secret.getNewValue()))
                    return ResponseEntity.badRequest().body("New password cannot be the same.");
                s.setValue(encoder.encode(secret.getNewValue()));
                secretsRepository.save(s);
                return ResponseEntity.ok("Secret updated.");
            }
            return ResponseEntity.badRequest().body("Wrong password.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private SecretsDAO getSecretIfExist(String type) {
        return secretsRepository.findById(type).orElse(null);
    }
}
