package com.studyroom.backend.controller;


import com.studyroom.backend.service.StudyMaterialService;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/studyMaterials")
@CrossOrigin("*")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialService studyMaterialService;

    @PostMapping("/upload/{roomCode}")
    public ResponseEntity<String> uploadStudyMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String senderName,
            @PathVariable("roomCode") String roomCode
    ) {
        System.out.println("Reached to upload controller");
        HttpStatus result = studyMaterialService.uploadStudyMaterial(file,senderName,roomCode);
        if(result == HttpStatus.OK){
            System.out.println("Success in controller layer");
            return ResponseEntity.ok("File uploaded successfully");
        }
        else{
            System.out.println("Failure in controller layer");
            return ResponseEntity.internalServerError().body("An error occured");
        }
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<List<Document>> getAllMaterials(@PathVariable String roomCode){
        List<Document> materials = studyMaterialService.getAllMaterials(roomCode);
        return ResponseEntity.ok(materials);
    }
}
