package com.studyroom.backend.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private Long senderId;
    private String senderName;
    private String content;
    private String roomCode;
}
