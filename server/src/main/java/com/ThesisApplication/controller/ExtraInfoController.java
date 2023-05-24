package com.ThesisApplication.controller;


import com.ThesisApplication.DAO_Classes.ExtraInfoDAO;
import com.ThesisApplication.services.ExtraInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/extra_info")
@CrossOrigin(origins = "http://localhost:3000")
public class ExtraInfoController {

    @Autowired
    private ExtraInfoService extraInfoService;

    @PostMapping(path = "/")
    public ResponseEntity<String> postExtraInfo(@RequestBody ExtraInfoDAO extraInfo) {
        return extraInfoService.postExtraInfo(extraInfo);
    }

    @GetMapping(path = "/artwork_id/{id}")
    public ResponseEntity getAllExtraInfoForArtworkId(@PathVariable int id) {
        return extraInfoService.getAllExtraInfoForArtworkId(id);
    }

    @DeleteMapping(path = "/")
    public ResponseEntity deleteExtraInfo(@RequestBody ExtraInfoDAO extraInfo){
        return extraInfoService.deleteExtraInfo(extraInfo);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getAllExtraInfoForId(@PathVariable int id) {
        return extraInfoService.getAllExtraInfoForId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity editEquipment(@PathVariable int id, @RequestBody ExtraInfoDAO extraInfoNewData) {
        return extraInfoService.editEquipment(id, extraInfoNewData);
    }
}