package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.ArtworkDTO;
import com.ThesisApplication.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ZoomPointService zoomPointService;

    @Autowired
    private ExtraInfoService extraInfoService;

    public ResponseEntity<String> postArtwork(MultipartFile file, ArtworkDTO artwork) {
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File can't be null.");

        if (checkInfo(artwork))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        ResponseEntity response = userService.checkRole(artwork.getInsertedBy());
        if (response.getStatusCodeValue() == 400)
            return response;

        try {
            artwork.setImage(file.getBytes());
            artworkRepository.save(artwork);
            return ResponseEntity.status(201).body("Artwork created with name: " + artwork.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getByName(String name) {
        if (name == null || name.equals(""))
            return ResponseEntity.badRequest().body("Name cannot be null or empty.");

        List<ArtworkDTO> artworkList = artworkRepository.findByName(name);
        if (artworkList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        return ResponseEntity.ok().body(artworkList);
    }

    public ResponseEntity getByUser(String email) {

        if (email == null || email.equals(""))
            return ResponseEntity.badRequest().body("User cannot be null or empty.");

        List<ArtworkDTO> artworkList = artworkRepository.findByInsertedBy(email);
        if (artworkList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(artworkList);
    }

    public ResponseEntity getById(int id) {

        Optional<ArtworkDTO> artworkData = artworkRepository.findById(id);

        if (artworkData.isPresent()) {
            return ResponseEntity.ok().body(artworkData.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity<List<ArtworkDTO>> getAllArtworks() {
        List<ArtworkDTO> listArtwork = artworkRepository.findAllByOrderByIdAsc();
        return ResponseEntity.ok().body(listArtwork);
    }

    public ResponseEntity editArtworkSameFile(int id, ArtworkDTO artworkNewData) {
        if (checkInfo(artworkNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        return updateArtworkData(id, artworkNewData, null);
    }

    public ResponseEntity editArtworkNewFile(MultipartFile file, ArtworkDTO artworkNewData, int id) {
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File can't be null.");

        if (checkInfo(artworkNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");

        return updateArtworkData(id, artworkNewData, file);
    }

    public ResponseEntity deleteArtwork(@RequestBody ArtworkDTO artwork){
        int id = artwork.getId();
        if(!artworkRepository.existsById(id))
            return ResponseEntity.badRequest().body("Artwork does not exist with such id.");
        ResponseEntity response = userService.checkRole(artwork.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            pdfService.deletePdfByArtworkId(id);
            extraInfoService.deleteExtraInfoByArtworkId(id);
            zoomPointService.deleteZoomPointByArtworkId(id);
            artworkRepository.deleteById(artwork.getId());
            return ResponseEntity.status(200).body("Artwork deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private ResponseEntity updateArtworkData(int id, ArtworkDTO artworkNewData, MultipartFile file) {
        try {

            ArtworkDTO artwork = getArtworkIfExist(id);
            if (artwork == null)
                return ResponseEntity.badRequest().body("Artwork does not exist.");

            ResponseEntity response = userService.checkRole(artworkNewData.getInsertedBy());
            if (response.getStatusCodeValue() == 400)
                return response;

            artworkNewData.setId(artwork.getId());
            if (file == null)
                artworkNewData.setImage(artwork.getImage());
            else {
                artworkNewData.setImage(file.getBytes());
                artworkNewData.setPixelWidth(artwork.getPixelWidth());
                artworkNewData.setPixelHeight(artwork.getPixelHeight());
            }

            final ArtworkDTO updatedArtwork = artworkRepository.save(artworkNewData);
            return ResponseEntity.ok(updatedArtwork);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private ArtworkDTO getArtworkIfExist(int id) {
        return artworkRepository.findById(id).orElse(null);
    }
    private boolean checkInfo(ArtworkDTO art) {
        return art == null || art.getName() == null || art.getName().equals("") || art.getArtType() == null || art.getArtType().equals("") || art.getSource() == null || art.getSource().equals("") ||
                art.getInvNumber() == null || art.getInvNumber().equals("") || art.getSuperCategory() == null || art.getSuperCategory().equals("")
                || art.getCategory() == null || art.getCategory().equals("") || art.getMatter() == null || art.getMatter().equals("") ||
                art.getWidth() <= 0 || art.getHeight() <= 0 || art.getPixelWidth() < 0 || art.getPixelHeight() < 0 || art.getInsertedBy() == null || art.getInsertedBy().equals("");
    }

}
