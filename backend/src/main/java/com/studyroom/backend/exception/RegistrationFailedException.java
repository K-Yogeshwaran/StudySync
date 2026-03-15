package com.studyroom.backend.exception;

public class RegistrationFailedException extends RuntimeException{

    public RegistrationFailedException(String message){
        super(message);
    }
}
