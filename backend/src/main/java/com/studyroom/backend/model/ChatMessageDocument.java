package com.studyroom.backend.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDocument {

    @Id
    private String id;

    @Indexed
    private String roomCode;

    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime timeStamp;
}
