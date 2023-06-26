package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.SecretsDTO;
import com.ThesisApplication.DTOClasses.UserDTO;
import com.ThesisApplication.controller.Enums;
import com.ThesisApplication.controller.Enums.Role;
import com.ThesisApplication.repository.SecretsRepository;
import com.ThesisApplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecretsRepository secretsRepository;

    public ResponseEntity<String> postUser(UserDTO userDTO){
        if(userDTO == null || userDTO.getEmail() == null || userDTO.getEmail().equals("") || userDTO.getPassword() == null || userDTO.getPassword().equals("") ||
                userDTO.getRole() == null || userDTO.getRole().equals("") || userDTO.getName() == null || userDTO.getName().equals("") || userDTO.getUniversity() == null || userDTO.getUniversity().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if(userRepository.existsById(userDTO.getEmail()))
            return ResponseEntity.badRequest().body(userDTO.getEmail() +" already exists in our system.");

        if(!secretApproving(userDTO))
            return ResponseEntity.badRequest().body("Wrong password for secrets.");

        try {
            //userRepository.save(new UserDTO(userDTO.getEmail(), userDTO.getName(), encoder.encode(userDTO.getPassword()), userDTO.getUniversity(), userDTO.getRole()));
            userDTO.setPassword(encoder.encode(userDTO.getPassword()));
            userRepository.save(userDTO);
            return ResponseEntity.status(201).body("User created with email: " + userDTO.getEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity updateUser(UserDTO userDTO){
        UserDTO user = getUserIfExist(userDTO.getEmail());

        if(user == null)
            return ResponseEntity.badRequest().body("This email does not exist.");
        if(userDTO == null || userDTO.getEmail() == null || userDTO.getEmail().equals("") || userDTO.getPassword() == null || userDTO.getPassword().equals("") ||
                userDTO.getRole() == null || userDTO.getRole().equals("") || userDTO.getName() == null || userDTO.getName().equals("") || userDTO.getUniversity() == null || userDTO.getUniversity().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        try {
            user.setName(userDTO.getName());
            user.setRole(userDTO.getRole());
            user.setUniversity(userDTO.getUniversity());

            final UserDTO updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity updatePassword(UserDTO userDTO){
        if (userDTO.getNewPw() == null || userDTO.getNewPw().equals(""))
            return ResponseEntity.badRequest().body("New password cannot be empty");
        UserDTO user = getUserIfExist(userDTO.getEmail());

        if(user == null)
            return ResponseEntity.badRequest().body("This email does not exist.");

        if(!encoder.matches(userDTO.getPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body("Wrong password.");

        try {
            user.setPassword(encoder.encode(userDTO.getNewPw()));

            final UserDTO updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok().body(userRepository.findAll());
    }

    public ResponseEntity Login(UserDTO user) {
        if(user == null || user.getEmail() == null || user.getEmail().equals("") || user.getPassword() == null || user.getPassword().equals(""))
            return ResponseEntity.badRequest().body("Wrong data.");

        UserDTO u = getUserIfExist(user.getEmail());
        if(u == null)
            return ResponseEntity.badRequest().body("This email does not exist.");
        if(!encoder.matches(user.getPassword(), u.getPassword()))
            return ResponseEntity.badRequest().body("Wrong password.");
        return ResponseEntity.ok().body(u);
    }

    public ResponseEntity userByEmail(String email) {
        if(email == null || email.equals(""))
            return ResponseEntity.badRequest().body("Email can't be null or empty.");

        Optional<UserDTO> userData = userRepository.findById(email);

        if (userData.isPresent()) {
            return ResponseEntity.ok().body(userData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity adminEditRole(String email, UserDTO user){
        if(email == null || email.equals("") || user == null || user.getEmail() == null || user.getEmail().equals("") || user.getPassword() == null || user.getPassword().equals("") || user.getRole() == null || user.getRole().equals(""))
            return ResponseEntity.badRequest().body("Wrong or invalid data.");
        UserDTO admin = getUserIfExist(user.getEmail());
        if (admin == null)
            return ResponseEntity.badRequest().body("Admin does not exist.");
        if (!admin.getRole().equals(Role.admin.name()))
            return ResponseEntity.badRequest().body("Insufficient permissions.");
        UserDTO userToEdit = getUserIfExist(email);
        if (userToEdit == null)
            return ResponseEntity.badRequest().body("User does not exist with email:" + email + ".");
        if (userToEdit.getRole().equals(Role.admin.name()))
            return ResponseEntity.badRequest().body("Both users have same permissions.");
        SecretsDTO secret = getSecretIfExist("updateRole");
        if((user.getRole().equals(Role.admin.name()) || user.getRole().equals(Role.researcher.name())) && !encoder.matches(user.getPassword(), secret.getValue()))
            return ResponseEntity.badRequest().body("Wrong secret to update user.");

        try {
            userToEdit.setRole(user.getRole());

            final UserDTO updatedUser = userRepository.save(userToEdit);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity checkRole(String email) {
        UserDTO user = getUserIfExist(email);
        if (user == null)
            return ResponseEntity.badRequest().body("User does not exist.");
        String role = user.getRole();
        if (role.equals(Role.researcher.name()) || role.equals(Role.admin.name()))
            return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("Insufficient permissions.");
    }

    private UserDTO getUserIfExist(String email) {
        return userRepository.findById(email).orElse(null);
    }

    private SecretsDTO getSecretIfExist(String type) {
        return secretsRepository.findById(type).orElse(null);
    }

    private boolean secretApproving(UserDTO user){
        String role = user.getRole();
        if(role.equals(Enums.Role.researcher.name())) {
            Optional<SecretsDTO> secret = secretsRepository.findById(Enums.Secrets.researcherPassword.name());
            if(secret.isPresent()){
                String pw = secret.get().getValue();
                if (encoder.matches(user.getNewPw(), pw))
                    return true;
                else
                    return false;
            }
        }
        if(role.equals(Enums.Role.admin.name())) {
            Optional<SecretsDTO> secret = secretsRepository.findById(Enums.Secrets.adminPassword.name());
            if(secret.isPresent()){
                String pw = secret.get().getValue();
                if (encoder.matches(user.getNewPw(), pw))
                    return true;
                else
                    return false;
            }
        }
        return true;
    }

}
