package com.studyroom.backend.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudyMaterialService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    public HttpStatus uploadStudyMaterial(MultipartFile file, String senderName, String roomCode){
        System.out.println("Reached the Upload Service Layer");
        Document metadata = new Document();
        metadata.append("roomCode",roomCode);
        metadata.append("uploadedBy",senderName);
        metadata.append("contentType",file.getContentType());

        try{
            var fileId = gridFsTemplate.store(file.getInputStream(),file.getOriginalFilename(),file.getContentType(),metadata);
            System.out.println("Success in service layer");
            return HttpStatus.OK;
        }
        catch(IOException ioException){
            System.out.println("Failure in service layer");
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    public List<Document> getAllMaterials(String roomCode){
        List<Document> materials = new ArrayList<>();
        Query query = new Query(Criteria.where("metadata.roomCode").is(roomCode));

        gridFsTemplate.find(query).forEach(result -> {
            Document document = new Document();
            document.append("fileId",result.getObjectId().toString());
            document.append("fileName",result.getFilename());
            document.append("contentType",result.getMetadata().get("contentType"));
            document.append("uploadedBy", result.getMetadata().get("uploadedBy"));
            materials.add(document);
        });
        return materials;
    }

}
