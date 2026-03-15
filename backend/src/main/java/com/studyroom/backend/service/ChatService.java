package com.studyroom.backend.service;


import com.studyroom.backend.model.ChatMessage;
import com.studyroom.backend.model.ChatMessageDocument;
import com.studyroom.backend.repository.mongodb.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;


    public void saveMessage(ChatMessage message) {

        ChatMessageDocument newMessage = new ChatMessageDocument(
                null ,
                message.getRoomCode(),
                message.getSenderId(),
                message.getSenderName(),
                message.getContent(),
                LocalDateTime.now()
        );
        chatMessageRepository.save(newMessage);
    }

    public List<ChatMessageDocument> getChatHistoryByRoomCode(String roomCode) {
        return chatMessageRepository.findByRoomCodeOrderByTimeStampAsc(roomCode);
    }
}
