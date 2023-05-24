package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.SecretsDAO;
import com.ThesisApplication.DAO_Classes.UserDAO;
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

    public ResponseEntity<String> postUser(UserDAO userDAO){
        if(userDAO == null || userDAO.getEmail() == null || userDAO.getEmail().equals("") || userDAO.getPassword() == null || userDAO.getPassword().equals("") ||
                userDAO.getRole() == null || userDAO.getRole().equals("") || userDAO.getName() == null || userDAO.getName().equals("") || userDAO.getUniversity() == null || userDAO.getUniversity().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if(userRepository.existsById(userDAO.getEmail()))
            return ResponseEntity.badRequest().body(userDAO.getEmail() +" already exists in our system.");

        if(!secretApproving(userDAO))
            return ResponseEntity.badRequest().body("Wrong password for secrets.");

        try {
            userRepository.save(new UserDAO(userDAO.getEmail(), userDAO.getName(), encoder.encode(userDAO.getPassword()), userDAO.getUniversity(), userDAO.getRole()));
            return ResponseEntity.status(201).body("User created with email: " + userDAO.getEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity updateUser(UserDAO userDAO){
        UserDAO user = getUserIfExist(userDAO.getEmail());

        if(user == null)
            return ResponseEntity.badRequest().body("This email does not exist.");
        if(userDAO == null || userDAO.getEmail() == null || userDAO.getEmail().equals("") || userDAO.getPassword() == null || userDAO.getPassword().equals("") ||
                userDAO.getRole() == null || userDAO.getRole().equals("") || userDAO.getName() == null || userDAO.getName().equals("") || userDAO.getUniversity() == null || userDAO.getUniversity().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        try {
            user.setName(userDAO.getName());
            user.setRole(userDAO.getRole());
            user.setUniversity(userDAO.getUniversity());

            final UserDAO updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity updatePassword(UserDAO userDAO){
        if (userDAO.getNewPw() == null || userDAO.getNewPw().equals(""))
            return ResponseEntity.badRequest().body("New password cannot be empty");
        UserDAO user = getUserIfExist(userDAO.getEmail());

        if(user == null)
            return ResponseEntity.badRequest().body("This email does not exist.");

        if(!encoder.matches(userDAO.getPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body("Wrong password.");

        try {
            user.setPassword(encoder.encode(userDAO.getNewPw()));

            final UserDAO updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity<List<UserDAO>> getAllUsers() {
        return ResponseEntity.ok().body(userRepository.findAll());
    }

    public ResponseEntity Login(UserDAO user) {
        if(user == null || user.getEmail() == null || user.getEmail().equals("") || user.getPassword() == null || user.getPassword().equals(""))
            return ResponseEntity.badRequest().body("Wrong data.");

        UserDAO u = getUserIfExist(user.getEmail());
        if(u == null)
            return ResponseEntity.badRequest().body("This email does not exist.");
        if(!encoder.matches(user.getPassword(), u.getPassword()))
            return ResponseEntity.badRequest().body("Wrong password.");
        return ResponseEntity.ok().body(u);
    }

    public ResponseEntity userByEmail(String email) {
        if(email == null || email.equals(""))
            return ResponseEntity.badRequest().body("Email can't be null or empty.");

        Optional<UserDAO> userData = userRepository.findById(email);

        if (userData.isPresent()) {
            return ResponseEntity.ok().body(userData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity adminEditRole(String email, UserDAO user){
        if(email == null || email.equals("") || user == null || user.getEmail() == null || user.getEmail().equals("") || user.getPassword() == null || user.getPassword().equals("") || user.getRole() == null || user.getRole().equals(""))
            return ResponseEntity.badRequest().body("Wrong or invalid data.");
        UserDAO admin = getUserIfExist(user.getEmail());
        if (admin == null)
            return ResponseEntity.badRequest().body("Admin does not exist.");
        if (!admin.getRole().equals(Role.admin.name()))
            return ResponseEntity.badRequest().body("Insufficient permissions.");
        UserDAO userToEdit = getUserIfExist(email);
        if (userToEdit == null)
            return ResponseEntity.badRequest().body("User does not exist with email:" + email + ".");
        if (userToEdit.getRole().equals(Role.admin.name()))
            return ResponseEntity.badRequest().body("Both users have same permissions.");
        SecretsDAO secret = getSecretIfExist("updateRole");
        if((user.getRole().equals(Role.admin.name()) || user.getRole().equals(Role.researcher.name())) && !encoder.matches(user.getPassword(), secret.getValue()))
            return ResponseEntity.badRequest().body("Wrong secret to update user.");

        try {
            userToEdit.setRole(user.getRole());

            final UserDAO updatedUser = userRepository.save(userToEdit);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity checkRole(String email) {
        UserDAO user = getUserIfExist(email);
        if (user == null)
            return ResponseEntity.badRequest().body("User does not exist.");
        String role = user.getRole();
        if (role.equals(Role.researcher.name()) || role.equals(Role.admin.name()))
            return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("Insufficient permissions.");
    }

    private UserDAO getUserIfExist(String email) {
        return userRepository.findById(email).orElse(null);
    }

    private SecretsDAO getSecretIfExist(String type) {
        return secretsRepository.findById(type).orElse(null);
    }

    private boolean secretApproving(UserDAO user){
        String role = user.getRole();
        if(role.equals(Enums.Role.researcher.name())) {
            Optional<SecretsDAO> secret = secretsRepository.findById(Enums.Secrets.researcherPassword.name());
            if(secret.isPresent()){
                String pw = secret.get().getValue();
                if (encoder.matches(user.getNewPw(), pw))
                    return true;
                else
                    return false;
            }
        }
        if(role.equals(Enums.Role.admin.name())) {
            Optional<SecretsDAO> secret = secretsRepository.findById(Enums.Secrets.adminPassword.name());
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
