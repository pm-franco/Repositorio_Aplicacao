package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.ZoomPointDAO;
import com.ThesisApplication.repository.ArtworkRepository;
import com.ThesisApplication.repository.ZoomPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ZoomPointService {

    @Autowired
    private ZoomPointRepository zoomPointRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EquipmentService equipmentService;

    public ResponseEntity postZoomPoint(MultipartFile file, ZoomPointDAO zoomPoint) {
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File can't be null");
        if (checkInfo(zoomPoint))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        Integer zoomPointId = zoomPoint.getZoomPointId();
        if (zoomPointId == null) {
            if(!artworkRepository.existsById(zoomPoint.getArtworkId()))
                return ResponseEntity.badRequest().body("Artwork does not exist.");
        }else {
            if(!zoomPointRepository.existsById(zoomPointId))
                return ResponseEntity.badRequest().body("Zoom Point does not exist.");
        }
        ResponseEntity response = userService.checkRole(zoomPoint.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            zoomPointRepository.save(new ZoomPointDAO(zoomPoint.getId(), zoomPoint.getArtworkId(), zoomPoint.getPositionX(), zoomPoint.getPositionY(), zoomPoint.getFileSize(), zoomPoint.getMetricWidth(), zoomPoint.getMetricHeight(), zoomPoint.getName(), zoomPoint.getLayerName(), zoomPoint.getAuthor(), zoomPoint.getTechnique(), file.getBytes(), zoomPoint.getDate(), zoomPoint.getCopyrights(), zoomPoint.getMaterials(), zoomPointId, zoomPoint.getPixelWidth(), zoomPoint.getPixelHeight()));
            return ResponseEntity.status(201).body("Zoom Point created with name: " + zoomPoint.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity<List<ZoomPointDAO>> getByArtworkId(int id) {
        List<ZoomPointDAO> pointList = zoomPointRepository.findByArtworkId(id);

        if (pointList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(pointList);
    }

    public ResponseEntity<List<ZoomPointDAO>> getByZoomPointId(int id) {
        List<ZoomPointDAO> pointList = zoomPointRepository.findByZoomPointId(id);

        if (pointList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(pointList);
    }


    public ResponseEntity getById(int id) {

        Optional<ZoomPointDAO> pointData = zoomPointRepository.findById(id);

        if (pointData.isPresent())
            return ResponseEntity.ok().body(pointData.get());
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity editZoomPointNewFile(int id, MultipartFile file, ZoomPointDAO zoomPointNewData) {
        if (file == null || file.isEmpty())
            return ResponseEntity.badRequest().body("File can't be null");
        if (checkInfo(zoomPointNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        int zoomPointId = zoomPointNewData.getZoomPointId();
        if (zoomPointId == 0) {
            if(!artworkRepository.existsById(zoomPointNewData.getArtworkId()))
                return ResponseEntity.badRequest().body("Artwork does not exist.");
        }else {
            if(!zoomPointRepository.existsById(zoomPointId))
                return ResponseEntity.badRequest().body("Zoom Point does not exist.");
        }
        ResponseEntity response = userService.checkRole(zoomPointNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        return updateZoomPointData(id, zoomPointNewData, file);
    }

    public ResponseEntity editZoomPointSameFile(int id, ZoomPointDAO zoomPointNewData) {
        if (checkInfo(zoomPointNewData))
            return ResponseEntity.badRequest().body("Some required information is null or empty.");
        int zoomPointId = zoomPointNewData.getZoomPointId();
        if (zoomPointId == 0) {
            if(!artworkRepository.existsById(zoomPointNewData.getArtworkId()))
                return ResponseEntity.badRequest().body("Artwork does not exist.");
        }else {
            if(!zoomPointRepository.existsById(zoomPointId))
                return ResponseEntity.badRequest().body("Zoom Point does not exist.");
        }
        ResponseEntity response = userService.checkRole(zoomPointNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        return updateZoomPointData(id, zoomPointNewData, null);
    }

    public ResponseEntity deletePoint(@RequestBody ZoomPointDAO zoomPoint){
        if(!zoomPointRepository.existsById(zoomPoint.getId()))
            return ResponseEntity.badRequest().body("Zoom point does not exist with such id.");
        ResponseEntity response = userService.checkRole(zoomPoint.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            equipmentService.deleteEquipmentByZoomPointId(zoomPoint.getId());
            zoomPointRepository.deleteById(zoomPoint.getId());
            return ResponseEntity.status(200).body("Extra Info deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public boolean isLayerNameEmpty(String layer){
        return zoomPointRepository.findByLayerName(layer).isEmpty();
    }

    private ResponseEntity updateZoomPointData(int id, ZoomPointDAO zoomPointNewData, MultipartFile file) {
        try {
            ZoomPointDAO zoomPoint = getZoomPointIfExist(id);

            if (zoomPoint == null)
                return ResponseEntity.badRequest().body("ZoomPoint does not exist.");

            zoomPointNewData.setId(zoomPoint.getId());
            if (file == null)
                zoomPointNewData.setImage(zoomPoint.getImage());
            else
                zoomPointNewData.setImage(file.getBytes());

            final ZoomPointDAO updatedPoint = zoomPointRepository.save(zoomPointNewData);
            return ResponseEntity.ok(updatedPoint);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public void deleteZoomPointByArtworkId(int id){
        List<ZoomPointDAO> zoomPointList = zoomPointRepository.findByArtworkId(id);
        if (!zoomPointList.isEmpty()){
            for(ZoomPointDAO p : zoomPointList)
                deletePoints(p.getId());
            zoomPointRepository.deleteAll(zoomPointList);
        }
    }

    private void deletePoints(int id){
        try {
            equipmentService.deleteEquipmentByZoomPointId(id);
            zoomPointRepository.deleteById(id);
        } catch (Exception e) {
            ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean checkInfo(ZoomPointDAO z) {
        return z == null || z.getPositionX() < 0 || z.getPositionY() < 0 || z.getName() == null || z.getName().equals("") ||
                z.getMetricWidth() < 0 || z.getMetricHeight() < 0 || z.getLayerName() == null ||
                z.getLayerName().equals("") || z.getAuthor() == null || z.getAuthor().equals("");
    }

    private ZoomPointDAO getZoomPointIfExist(int id) {
        return zoomPointRepository.findById(id).orElse(null);
    }
}
