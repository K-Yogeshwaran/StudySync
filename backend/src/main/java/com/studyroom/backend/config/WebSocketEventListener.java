package com.studyroom.backend.config;

import com.studyroom.backend.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Component
public class WebSocketEventListener {

    @Autowired
    private PresenceService presenceService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String)headerAccessor.getSessionAttributes().get("username");
        String roomId = (String)headerAccessor.getSessionAttributes().get("room_id");

        if(username != null && roomId != null){

            presenceService.userLeft(roomId,username);

            Set<Object> currentUsers = presenceService.getOnlineUsers(roomId);
            messagingTemplate.convertAndSend("/topic/"+roomId+"/presence",currentUsers);
        }
    }
}
