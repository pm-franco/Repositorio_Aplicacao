package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.PdfDAO;
import com.ThesisApplication.repository.ArtworkRepository;
import com.ThesisApplication.repository.PdfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PdfService {

    @Autowired
    private PdfRepository pdfRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;


    public ResponseEntity<String> postPdf(MultipartFile file, PdfDAO pdf) {
        if (pdf.getName() == null || pdf.getName().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if ((file == null || file.isEmpty()) && (pdf.getLink() == null || pdf.getLink().equals("")))
            return ResponseEntity.badRequest().body("File and link cannot be null.");

        if (!artworkRepository.existsById(pdf.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");
        if(pdf.getLink().equals(""))
            pdf.setLink(null);
        ResponseEntity response = userService.checkRole(pdf.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            pdfRepository.save(new PdfDAO(pdf.getId(), pdf.getArtworkId(), pdf.getName(), getBytes(file), pdf.getLink()));
            return ResponseEntity.status(201).body("Pdf added with name: " + pdf.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    public ResponseEntity postPdf(PdfDAO pdf) {
        if (pdf.getName() == null || pdf.getName().equals(""))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        if (pdf.getLink() == null || pdf.getLink().equals(""))
            return ResponseEntity.badRequest().body("File and link cannot be null.");

        if (!artworkRepository.existsById(pdf.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(pdf.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        try {
            pdfRepository.save(new PdfDAO(pdf.getId(), pdf.getArtworkId(), pdf.getName(), null, pdf.getLink()));
            return ResponseEntity.status(201).body("Pdf added with name: " + pdf.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getAllPdfForArtworkId(@PathVariable int id) {
        List<PdfDAO> pdfList = pdfRepository.findByArtworkId(id);
        if (pdfList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(pdfList);
    }

    public ResponseEntity getPdfForId(@PathVariable int id) {
        Optional<PdfDAO> pdfData = pdfRepository.findById(id);
        if (pdfData.isPresent())
            return ResponseEntity.ok().body(pdfData.get());
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity deletePdf(@RequestBody PdfDAO pdf){
        if(!pdfRepository.existsById(pdf.getId()))
            return ResponseEntity.badRequest().body("Pdf does not exist with such id.");
        ResponseEntity response = userService.checkRole(pdf.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            pdfRepository.deleteById(pdf.getId());
            return ResponseEntity.status(200).body("Pdf deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public void deletePdfByArtworkId(int id){
        List<PdfDAO> pdfList = pdfRepository.findByArtworkId(id);
        if (!pdfList.isEmpty()){
            pdfRepository.deleteAll(pdfList);
        }
    }

    private byte[] getBytes(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty())
            return null;
        return file.getBytes();
    }
}
