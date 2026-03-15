package com.studyroom.backend.config;


import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class RoomCodeGenerator {

    private final String AllowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final int MaxCharacters = 6;

    private SecureRandom secureRandom = new SecureRandom();

    public RoomCodeGenerator getInstance(){
        return new RoomCodeGenerator();
    }

    public String  generateRandomRoomCode(){

        StringBuilder sb = new StringBuilder(MaxCharacters);

        for(int i = 0; i < sb.capacity(); i++){

            int randomIndex = secureRandom.nextInt(AllowedCharacters.length());
            sb.append(AllowedCharacters.charAt(randomIndex));
        }
        return sb.toString();

    }
}
