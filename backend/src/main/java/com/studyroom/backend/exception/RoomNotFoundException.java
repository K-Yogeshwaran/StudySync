package com.studyroom.backend.exception;



public class RoomNotFoundException extends RuntimeException{

    public RoomNotFoundException(String message){
        super(message);
    }
}
