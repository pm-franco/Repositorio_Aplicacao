package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.UserDAO;
import com.ThesisApplication.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path= "/")
    public ResponseEntity<String> postUser(@RequestBody UserDAO userDAO){
        return userService.postUser(userDAO);
    }

    @PutMapping("/")
    public ResponseEntity updateUser(@RequestBody UserDAO userDAO){
        return userService.updateUser(userDAO);
    }

    @PutMapping("/password")
    public ResponseEntity updatePassword(@RequestBody UserDAO userDAO){
        return userService.updatePassword(userDAO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDAO>> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public ResponseEntity Login(@RequestBody UserDAO user) {
        return userService.Login(user);
    }

    @GetMapping(path = "/email/{email}")
    public ResponseEntity userByEmail(@PathVariable String email) {
        return userService.userByEmail(email);
    }

    @PutMapping (path = "/edit/{email}")
    public ResponseEntity adminEditRole(@PathVariable String email, @RequestBody UserDAO user){
        return userService.adminEditRole(email, user);
    }
}
