package com.studyroom.backend.controller;


import com.studyroom.backend.model.ChatMessage;
import com.studyroom.backend.model.ChatMessageDocument;
import com.studyroom.backend.service.ChatService;
import com.studyroom.backend.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    @Autowired
    private PresenceService presenceService;

    @MessageMapping("/chat.addUser/{roomId}")
    //@SendTo("/topic/{roomId}/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor,
                               @DestinationVariable String roomId){
        headerAccessor.getSessionAttributes().put("username",chatMessage.getSenderName());
        headerAccessor.getSessionAttributes().put("room_id",roomId);

        presenceService.userJoined(roomId,chatMessage.getSenderName());
        Set<Object> onlineUsers = presenceService.getOnlineUsers(roomId);
        messagingTemplate.convertAndSend("/topic/"+roomId+"/presence",onlineUsers);
        messagingTemplate.convertAndSend("/rooms/"+roomId,chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat")
    public void chatMessage(ChatMessage message){
        System.out.println("Message arrived to the server.");
         chatService.saveMessage(message);
         messagingTemplate.convertAndSend("/rooms/"+message.getRoomCode() , message);
    }

    @MessageMapping("/canvas.update/{roomCode}")
    public void handleCanvasUpdate(@Payload Map<String, Object> payload,
                                   @DestinationVariable String roomCode){
        System.out.println("Canvas update received from room "+roomCode);
        messagingTemplate.convertAndSend("/topic/canvas/"+roomCode , (Object)payload);
    }

    @GetMapping("/chat/history/{roomCode}")
    public List<ChatMessageDocument> getChatHistoryByRoomCode(@PathVariable String roomCode){
        return chatService.getChatHistoryByRoomCode(roomCode);
    }


}
