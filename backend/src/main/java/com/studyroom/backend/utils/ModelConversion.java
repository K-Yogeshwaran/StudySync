package com.studyroom.backend.utils;


import com.studyroom.backend.dto.StudyRoomDTO;
import com.studyroom.backend.dto.UserDTO;
import com.studyroom.backend.model.StudyRoom;
import com.studyroom.backend.model.User;

import java.util.HashSet;
import java.util.Set;

public class ModelConversion {

    public static UserDTO convertToSimpleUserDTO(User user){

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                new HashSet<>(),
                new HashSet<> ()
        );
    }

    public static UserDTO convertToUserDTO(User user){
        Set<StudyRoomDTO> studyRoomDTOS = new HashSet<>();
        if(user.getCreatedRooms() != null){
            for(StudyRoom room : user.getCreatedRooms()){
                studyRoomDTOS.add(convertToSimpleStudyRoomDTO(room));
            }
        }

        Set<StudyRoomDTO> joinedRoomsDTOS = new HashSet<> ();
        if(user.getJoinedRooms() != null){
            for(StudyRoom room : user.getJoinedRooms()){
                joinedRoomsDTOS.add(convertToSimpleStudyRoomDTO(room));
            }
        }
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                studyRoomDTOS,
                joinedRoomsDTOS
        );
    }

    public static StudyRoomDTO convertToSimpleStudyRoomDTO(StudyRoom studyRoom){

        return new StudyRoomDTO(
                studyRoom.getId(),
                studyRoom.getRoomName(),
                studyRoom.getRoomCode(),
                studyRoom.getDescription(),
                studyRoom.getCreatedBy().getId(),
                studyRoom.getCreatedAt(),
                new HashSet<>()
        );
    }

    public static StudyRoomDTO convertToStudyRoomDTO(StudyRoom studyRoom){

        Set<UserDTO> userDTOS = new HashSet<>();

        if(studyRoom.getParticipants() != null){
            for(User user : studyRoom.getParticipants()){
                userDTOS.add(convertToSimpleUserDTO(user));
            }
        }
        return new StudyRoomDTO(
                studyRoom.getId(),
                studyRoom.getRoomName(),
                studyRoom.getRoomCode(),
                studyRoom.getDescription(),
                studyRoom.getCreatedBy().getId(),
                studyRoom.getCreatedAt(),
                userDTOS
        );
    }
}
