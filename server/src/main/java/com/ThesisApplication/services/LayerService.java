package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.LayerDTO;
import com.ThesisApplication.repository.ArtworkRepository;
import com.ThesisApplication.repository.LayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class LayerService {

    @Autowired
    private LayerRepository layerRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;

    public ResponseEntity postLayer(MultipartFile file, LayerDTO layer){
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File cannot be null.");
        if (layer.getLayerName() == null || layer.getLayerName().equals(""))
            return ResponseEntity.badRequest().body("Some information is null");
        if (!artworkRepository.existsById(layer.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");
        ResponseEntity response = userService.checkRole(layer.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            //layerRepository.save(new LayerDTO(layer.getId(), layer.getLayerName(), file.getBytes(), layer.getDepth(), layer.getArtworkId()));
            layer.setImage(file.getBytes());
            layerRepository.save(layer);
            return ResponseEntity.status(201).body("Layer added to artwork id : " + layer.getArtworkId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity deleteLayer(LayerDTO layer){
        if(!layerRepository.existsById(layer.getId()))
            return ResponseEntity.badRequest().body("Layer does not exist with such id.");
        ResponseEntity response = userService.checkRole(layer.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            layerRepository.deleteById(layer.getId());
            return ResponseEntity.status(200).body("Layer deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getByArtworkId(int id) {
        List<LayerDTO> layerList = layerRepository.findByArtworkIdOrderByDepthAsc(id);

        if (layerList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(layerList);
    }

    public ResponseEntity getById(int id) {
        Optional<LayerDTO> layerData = layerRepository.findById(id);
        if (layerData.isPresent())
            return ResponseEntity.ok().body(layerData.get());
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity editLayerNewFile(int id, MultipartFile file, LayerDTO layerNewData) {
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File can't be null");
        if (checkInfo(layerNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        if(!artworkRepository.existsById(layerNewData.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(layerNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        return updateLayerData(id, layerNewData, file);
    }

    public ResponseEntity editLayerSameFile(int id, LayerDTO layerNewData) {
        if (checkInfo(layerNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        if(!artworkRepository.existsById(layerNewData.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(layerNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        return updateLayerData(id, layerNewData, null);
    }

    private ResponseEntity updateLayerData(int id, LayerDTO layerNewData, MultipartFile file) {
        try {
            LayerDTO layer = getLayerIfExist(id);

            if (layer == null)
                return ResponseEntity.badRequest().body("Layer does not exist.");

            layerNewData.setId(layer.getId());
            layerNewData.setArtworkId(layer.getArtworkId());
            if (file == null)
                layerNewData.setImage(layer.getImage());
            else
                layerNewData.setImage(file.getBytes());

            final LayerDTO updatedLayer = layerRepository.save(layerNewData);
            return ResponseEntity.ok(updatedLayer);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean checkInfo(LayerDTO layer){
        return layer == null ||  layer.getLayerName() == null || layer.getLayerName().equals("");
    }

    private LayerDTO getLayerIfExist(int id) {
        return layerRepository.findById(id).orElse(null);
    }
}
