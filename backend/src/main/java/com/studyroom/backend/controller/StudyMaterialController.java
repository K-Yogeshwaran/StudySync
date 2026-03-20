package com.studyroom.backend.controller;


import com.mongodb.client.gridfs.model.GridFSFile;
import com.studyroom.backend.service.StudyMaterialService;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
        HttpStatus result;
        if(file == null){
            return ResponseEntity.internalServerError().build();
        }
        if(file.getOriginalFilename().endsWith(".pptx")){
            result = studyMaterialService.uploadPPTMaterial(file,senderName,roomCode);
        }
        else {
            result = studyMaterialService.uploadStudyMaterial(file, senderName, roomCode);
        }
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

    @GetMapping("/presentation/{presentationID}/slides")
    public ResponseEntity<List<String>> getPresenationSlides(@PathVariable String presentationID){
        List<String> result = studyMaterialService.getPresentationSlides(presentationID);
        if(result.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }


    @GetMapping("/download/{fileId}")
    public ResponseEntity<GridFsResource> downloadMaterial(@PathVariable String fileId){
        GridFsResource resource = studyMaterialService.downloadMaterial(fileId);

        if(resource == null){
            return ResponseEntity.notFound().build();
        }

        String contentType = resource.getContentType();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+resource.getFilename()+"\"")
                .body(resource);
    }


}
