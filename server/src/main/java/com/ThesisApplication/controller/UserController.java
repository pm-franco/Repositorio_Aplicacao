package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.UserDTO;
import com.ThesisApplication.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path= "/")
    public ResponseEntity<String> postUser(@RequestBody UserDTO userDTO){
        return userService.postUser(userDTO);
    }

    @PutMapping("/")
    public ResponseEntity updateUser(@RequestBody UserDTO userDTO){
        return userService.updateUser(userDTO);
    }

    @PutMapping("/password")
    public ResponseEntity updatePassword(@RequestBody UserDTO userDTO){
        return userService.updatePassword(userDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public ResponseEntity Login(@RequestBody UserDTO user) {
        return userService.Login(user);
    }

    @GetMapping(path = "/email/{email}")
    public ResponseEntity userByEmail(@PathVariable String email) {
        return userService.userByEmail(email);
    }

    @PutMapping (path = "/edit/{email}")
    public ResponseEntity adminEditRole(@PathVariable String email, @RequestBody UserDTO user){
        return userService.adminEditRole(email, user);
    }
}
