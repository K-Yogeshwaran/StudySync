package com.studyroom.backend.repository.mongodb;

import com.studyroom.backend.model.ChatMessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ChatMessageRepository extends MongoRepository<ChatMessageDocument,String> {

    public List<ChatMessageDocument> findByRoomCodeOrderByTimeStampAsc(String roomCode);
}
