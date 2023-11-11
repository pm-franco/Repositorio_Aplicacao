package com.ThesisApplication.controller;

import com.ThesisApplication.DTOClasses.PdfDTO;
import com.ThesisApplication.services.PdfService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/pdf")

public class PdfController {

    @Autowired
    private PdfService pdfService;

    static final Gson g = new Gson();

    @PostMapping(path = "/")
    public ResponseEntity<String> postPdf(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        PdfDTO pdf = g.fromJson(jsonObject, PdfDTO.class);
        return pdfService.postPdf(file, pdf);
    }

    @PostMapping(path = "/1")
    public ResponseEntity postPdf(@RequestBody PdfDTO pdf) {
        return pdfService.postPdf(pdf);
    }

    @GetMapping(path = "/artwork_id/{id}")
    public ResponseEntity getAllPdfForArtworkId(@PathVariable int id) {
        return pdfService.getAllPdfForArtworkId(id);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity getPdfForId(@PathVariable int id) {
        return pdfService.getPdfForId(id);
    }

    @DeleteMapping("/")
    public ResponseEntity deletePdf(@RequestBody PdfDTO pdf) {
        return pdfService.deletePdf(pdf);
    }
}
