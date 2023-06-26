package com.ThesisApplication.services;

import com.ThesisApplication.DTOClasses.ExtraInfoDTO;
import com.ThesisApplication.repository.ArtworkRepository;
import com.ThesisApplication.repository.ExtraInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    public ResponseEntity<String> postExtraInfo(ExtraInfoDTO extraInfo) {
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
            //extraInfoRepository.save(new ExtraInfoDTO(extraInfo.getId(), extraInfo.getArtworkId(), extraInfo.getLinks(), extraInfo.getInfo()));
            extraInfoRepository.save(extraInfo);
            return ResponseEntity.status(201).body("Extra Info created for artwork with id:" + extraInfo.getArtworkId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public ResponseEntity getAllExtraInfoForArtworkId(int id) {
        List<ExtraInfoDTO> extraInfoList = extraInfoRepository.findByArtworkId(id);
        if (extraInfoList.isEmpty())
            return ResponseEntity.badRequest().body(null);
        else
            return ResponseEntity.ok().body(extraInfoList.get(0));
    }

    public ResponseEntity deleteExtraInfo(ExtraInfoDTO extraInfo){
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
        Optional<ExtraInfoDTO> extraInfoData = extraInfoRepository.findById(id);
        if (extraInfoData.isPresent())
            return ResponseEntity.ok().body(extraInfoData.get());
        else
            return ResponseEntity.badRequest().body(null);
    }

    public ResponseEntity editEquipment(int id, ExtraInfoDTO extraInfoNewData) {
        if (extraInfoNewData == null)
            return ResponseEntity.badRequest().body("Extra Info can't be null");

        if ((extraInfoNewData.getLinks() == null || extraInfoNewData.getLinks().isEmpty()) && (extraInfoNewData.getInfo() == null || extraInfoNewData.getInfo().isEmpty()))
            return ResponseEntity.badRequest().body("All parameters can't be null");

        if (!artworkRepository.existsById(extraInfoNewData.getArtworkId()))
            return ResponseEntity.badRequest().body("Artwork does not exist.");

        ResponseEntity response = userService.checkRole(extraInfoNewData.getUser());
        if (response.getStatusCodeValue() == 400)
            return response;

        ExtraInfoDTO extraInfoDTO = getExtraInfoIfExist(id);
        if (extraInfoDTO == null)
            return ResponseEntity.badRequest().body("ExtraInfo does not exist.");

        try {
            extraInfoDTO.setLinks(extraInfoNewData.getLinks());
            extraInfoDTO.setInfo(extraInfoNewData.getInfo());

            final ExtraInfoDTO updatedExtraInfo = extraInfoRepository.save(extraInfoDTO);
            return ResponseEntity.ok(updatedExtraInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public void deleteExtraInfoByArtworkId(int id){
        List<ExtraInfoDTO> extraInfoList = extraInfoRepository.findByArtworkId(id);
        if (!extraInfoList.isEmpty()){
            extraInfoRepository.deleteAll(extraInfoList);
        }
    }

    private ExtraInfoDTO getExtraInfoIfExist(int id) {
        return extraInfoRepository.findById(id).orElse(null);
    }
}
