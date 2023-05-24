package com.ThesisApplication.controller;

import com.ThesisApplication.DAO_Classes.PdfDAO;
import com.ThesisApplication.services.PdfService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/pdf")
@CrossOrigin(origins = "http://localhost:3000")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    static final Gson g = new Gson();

    @PostMapping(path = "/")
    public ResponseEntity<String> postPdf(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonObject) {
        PdfDAO pdf = g.fromJson(jsonObject, PdfDAO.class);
        return pdfService.postPdf(file, pdf);
    }

    @PostMapping(path = "/1")
    public ResponseEntity postPdf(@RequestBody PdfDAO pdf) {
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
    public ResponseEntity deletePdf(@RequestBody PdfDAO pdf) {
        return pdfService.deletePdf(pdf);
    }
}
