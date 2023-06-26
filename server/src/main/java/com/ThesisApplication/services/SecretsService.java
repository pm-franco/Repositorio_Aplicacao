package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.SecretsDTO;
import com.ThesisApplication.repository.SecretsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SecretsService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Autowired
    private SecretsRepository secretsRepository;

    @Autowired
    private UserService userService;

    public ResponseEntity<String> postSecret(SecretsDTO secretsDTO) {
        if (secretsDTO == null || secretsDTO.getType() == null || secretsDTO.getType().equals("") || secretsDTO.getValue() == null || secretsDTO.getValue().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if (secretsRepository.existsById(secretsDTO.getType()))
            return ResponseEntity.badRequest().body(secretsDTO.getType() + " already exists in our system.");
        ResponseEntity response = userService.checkRole(secretsDTO.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            //secretsRepository.save(new SecretsDTO(secretsDTO.getType(), encoder.encode(secretsDTO.getValue())));
            secretsDTO.setValue(encoder.encode(secretsDTO.getValue()));
            secretsRepository.save(secretsDTO);
            return ResponseEntity.status(201).body("Secret added.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity secretByType(String type) {
        if (type == null || type.equals(""))
            return ResponseEntity.badRequest().body("Type cannot be null or empty.");

        Optional<SecretsDTO> secretData = secretsRepository.findById(type);

        if (secretData.isPresent()) {
            return ResponseEntity.ok().body(secretData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity matchSecret(SecretsDTO secretsDTO){
        SecretsDTO secret = getSecretIfExist(secretsDTO.getType());
        if (secret == null)
            return ResponseEntity.badRequest().body(secretsDTO.getType() + " does not exist in our system.");
        ResponseEntity response = userService.checkRole(secretsDTO.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        if (encoder.matches(secretsDTO.getValue(), secret.getValue()))
            return ResponseEntity.ok().body("Match");
        return ResponseEntity.badRequest().body("Wrong password.");
    }

    public ResponseEntity getAllSecrets() {
        return ResponseEntity.ok().body(secretsRepository.findAllByOrderByTypeAsc());
    }

    public ResponseEntity updateSecret(SecretsDTO secret) {
        if (secret == null || secret.getValue() == null || secret.getValue().equals("") || secret.getNewValue() == null || secret.getNewValue().equals(""))
            return ResponseEntity.badRequest().body("Wrong data");
        ResponseEntity response = userService.checkRole(secret.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        SecretsDTO s = getSecretIfExist(secret.getType());

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

    private SecretsDTO getSecretIfExist(String type) {
        return secretsRepository.findById(type).orElse(null);
    }
}
