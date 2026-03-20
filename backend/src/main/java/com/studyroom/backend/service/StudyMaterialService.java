package com.studyroom.backend.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    public HttpStatus uploadPPTMaterial(MultipartFile file, String senderName, String roomCode) {
        try (InputStream in = file.getInputStream()){
            Document parentMetaData = new Document();
            parentMetaData.append("uploadedBy", senderName);
            parentMetaData.append("roomCode",roomCode);
            parentMetaData.append("contentType",file.getContentType());

            String presentationGroupId = gridFsTemplate.store(file.getInputStream(),
                                                            file.getOriginalFilename(),
                                                            file.getContentType(),
                                                            parentMetaData).toString();


            XMLSlideShow slideShow = new XMLSlideShow(in);

            Dimension pgSize = slideShow.getPageSize();

            int slideIndex = 0;

            for(XSLFSlide slide : slideShow.getSlides()){

                BufferedImage img = new BufferedImage(pgSize.width,pgSize.height,BufferedImage.TYPE_INT_RGB);
                Graphics2D graphics = img.createGraphics();

                graphics.setPaint(Color.WHITE);
                graphics.fill(new Rectangle(pgSize));
                slide.draw(graphics);

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                ImageIO.write(img,"png",out);
                ByteArrayInputStream imageStream = new ByteArrayInputStream(out.toByteArray());

                String slideName = "slide_"+slideIndex+".png";

                Document metadata = new Document();
                metadata.append("senderName",senderName);
                metadata.append("roomCode",roomCode);
                metadata.append("presentationID", presentationGroupId);
                metadata.append("originalFileName", file.getOriginalFilename());
                metadata.append("slideIndex",slideIndex);
                metadata.append("contentType","image/png");

                gridFsTemplate.store(imageStream,slideName,"image/png",metadata);
                slideIndex++;

                graphics.dispose();
            }
            return HttpStatus.OK;
        }
        catch(Exception exception){
            System.out.println(exception.getMessage());
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

    }

    public List<String> getPresentationSlides(String presentationID){
        List<String> slideUrls = new ArrayList<> ();

        Query query = new Query(Criteria.where("metadata.presentationID").is(presentationID))
                .with(Sort.by(Sort.Direction.ASC,"metadata.slideIndex"));

        gridFsTemplate.find(query).forEach(file -> {
            String url = "http://localhost:8080/studyMaterials/download/"+file.getObjectId().toHexString();
            slideUrls.add(url);
        });

        return slideUrls;
    }

    public List<Document> getAllMaterials(String roomCode){
        List<Document> materials = new ArrayList<>();
        Query query = new Query(Criteria.where("metadata.roomCode").is(roomCode)
                .and("metadata.slideIndex").exists(false));

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

    public GridFsResource downloadMaterial(String fileId){
        Query query = new Query(Criteria.where("_id").is(fileId));
        GridFSFile file = gridFsTemplate.findOne(query);

        return gridFsTemplate.getResource(file);
    }

}
