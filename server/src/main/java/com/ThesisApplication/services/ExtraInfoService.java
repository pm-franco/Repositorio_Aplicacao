package com.ThesisApplication.services;

import com.ThesisApplication.DAO_Classes.ExtraInfoDAO;
import com.ThesisApplication.DAO_Classes.UserDAO;
import com.ThesisApplication.controller.Enums;
import com.ThesisApplication.repository.ArtworkRepository;
import com.ThesisApplication.repository.ExtraInfoRepository;
import com.ThesisApplication.repository.PdfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Service
public class ExtraInfoService {

    @Autowired
    private ExtraInfoRepository extraInfoRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;

    public ResponseEntity<String> postExtraInfo(ExtraInfoDAO extraInfo) {
        if (extraInfo == null)
            return ResponseEntity.badRequest().body("Extra Info can't be null");

        if ((extraInfo.getLinks() == null || extraInfo.getLinks().isEmpty()) && (extraInfo.getInfo() == null || extraInfo.getInfo().isEmpty()))
            return ResponseEntity.badRequest().body("All parameters can't be null");

        if (!artworkRepository.existsById(extraInfo.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(extraInfo.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            extraInfoRepository.save(new ExtraInfoDAO(extraInfo.getId(), extraInfo.getArtworkId(), extraInfo.getLinks(), extraInfo.getInfo()));
            return ResponseEntity.status(201).body("Extra Info created for artwork with id:" + extraInfo.getArtworkId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getAllExtraInfoForArtworkId(int id) {
        List<ExtraInfoDAO> extraInfoList = extraInfoRepository.findByArtworkId(id);
        if (extraInfoList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(extraInfoList.get(0));
    }

    public ResponseEntity deleteExtraInfo(ExtraInfoDAO extraInfo){
        if(!extraInfoRepository.existsById(extraInfo.getId()))
            return ResponseEntity.badRequest().body("Extra info does not exist with such id.");
        ResponseEntity response = userService.checkRole(extraInfo.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;
        try {
            extraInfoRepository.deleteById(extraInfo.getId());
            return ResponseEntity.status(200).body("Extra Info deleted.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getAllExtraInfoForId(int id) {
        Optional<ExtraInfoDAO> extraInfoData = extraInfoRepository.findById(id);
        if (extraInfoData.isPresent())
            return ResponseEntity.ok().body(extraInfoData.get());
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity editEquipment(int id, ExtraInfoDAO extraInfoNewData) {
        if (extraInfoNewData == null)
            return ResponseEntity.badRequest().body("Extra Info can't be null");

        if ((extraInfoNewData.getLinks() == null || extraInfoNewData.getLinks().isEmpty()) && (extraInfoNewData.getInfo() == null || extraInfoNewData.getInfo().isEmpty()))
            return ResponseEntity.badRequest().body("All parameters can't be null");

        if (!artworkRepository.existsById(extraInfoNewData.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(extraInfoNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        ExtraInfoDAO extraInfoDAO = getExtraInfoIfExist(id);
        if (extraInfoDAO == null)
            return ResponseEntity.badRequest().body("ExtraInfo does not exist.");

        try {
            extraInfoDAO.setLinks(extraInfoNewData.getLinks());
            extraInfoDAO.setInfo(extraInfoNewData.getInfo());

            final ExtraInfoDAO updatedExtraInfo = extraInfoRepository.save(extraInfoDAO);
            return ResponseEntity.ok(updatedExtraInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public void deleteExtraInfoByArtworkId(int id){
        List<ExtraInfoDAO> extraInfoList = extraInfoRepository.findByArtworkId(id);
        if (!extraInfoList.isEmpty()){
            extraInfoRepository.deleteAll(extraInfoList);
        }
    }

    private ExtraInfoDAO getExtraInfoIfExist(int id) {
        return extraInfoRepository.findById(id).orElse(null);
    }
}
