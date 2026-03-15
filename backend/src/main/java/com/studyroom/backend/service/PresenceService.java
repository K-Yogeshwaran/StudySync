package com.studyroom.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class PresenceService {

    @Autowired
    private RedisTemplate<String,Object> redisTemplate;

    private static final String ROOM_PREFIX = "room:presence:";

    public void userJoined(String roomId,String username){
        String key = ROOM_PREFIX+roomId;
        redisTemplate.opsForSet().add(key,username);
    }

    public void userLeft(String roomId, String username){
        String key = ROOM_PREFIX + roomId;
        redisTemplate.opsForSet().remove(key,username);
    }

    public Set<Object> getOnlineUsers(String roomId){
        String key = ROOM_PREFIX + roomId;
        return redisTemplate.opsForSet().members(key);
    }
}
