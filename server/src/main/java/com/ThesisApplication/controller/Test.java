package com.ThesisApplication.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class Test {


    @GetMapping(path = "/")
    public ResponseEntity HelloWorld() {
        return ResponseEntity.ok().body("Hello World.");
    }

}
