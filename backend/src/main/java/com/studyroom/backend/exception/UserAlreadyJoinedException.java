package com.studyroom.backend.exception;

public class UserAlreadyJoinedException extends RuntimeException{

    public UserAlreadyJoinedException(String message){
        super(message);
    }
}
