package com.studyroom.backend.service;


import com.studyroom.backend.config.RoomCodeGenerator;
import com.studyroom.backend.dto.CreateRoomRequestDTO;
import com.studyroom.backend.dto.JoinRoomRequestDTO;
import com.studyroom.backend.dto.StudyRoomDTO;
import com.studyroom.backend.dto.UserDTO;
import com.studyroom.backend.exception.RoomNotFoundException;
import com.studyroom.backend.exception.UserAlreadyJoinedException;
import com.studyroom.backend.exception.UserNotFoundException;
import com.studyroom.backend.model.StudyRoom;
import com.studyroom.backend.model.User;
import com.studyroom.backend.repository.mysql.StudyRoomRepository;
import com.studyroom.backend.repository.mysql.UserRepository;
import com.studyroom.backend.utils.ModelConversion;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class StudyRoomService {

    @Autowired
    private StudyRoomRepository studyRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomCodeGenerator roomCodeGenerator;

/*    public StudyRoomDTO createStudyRoom(CreateRoomRequestDTO roomDetails) {
        System.out.println("Service layer reached");
        String roomCode = roomCodeGenerator.generateRandomRoomCode();
        System.out.println("Room code generated : "+roomCode);
        User user = userRepository.findById(roomDetails.getCreaterUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        System.out.println("User found.");
        StudyRoom studyRoom = new StudyRoom(
                null,
                roomDetails.getRoomName(),
                roomCode,
                roomDetails.getDescription(),
                user,
                LocalDateTime.now(),
                new HashSet<>()
        );
        System.out.println("Study room object created.");

        System.out.println("User added to the participants list");
        StudyRoom createdStudyRoom = studyRoomRepository.save(studyRoom);
        createdStudyRoom.getParticipants().add(user);
        studyRoomRepository.save(createdStudyRoom);

        System.out.println("Study room saved to the database successfully");
        *//*user.getCreatedRooms().add(createdStudyRoom);*//*
        System.out.println("Room added to the user's createdRoom Set");
        return ModelConversion.convertToSimpleStudyRoomDTO(createdStudyRoom);
    }*/

    public StudyRoomDTO createStudyRoom(CreateRoomRequestDTO roomDetails) {

        System.out.println("Service layer reached");

        String roomCode = roomCodeGenerator.generateRandomRoomCode();
        System.out.println("Room code generated : " + roomCode);

        User user = userRepository.findById(roomDetails.getCreaterUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        System.out.println("User found.");

        StudyRoom studyRoom = new StudyRoom(
                null,
                roomDetails.getRoomName(),
                roomCode,
                roomDetails.getDescription(),
                user,
                LocalDateTime.now(),
                new HashSet<>()
        );

        System.out.println("Study room object created.");

        // ✅ SAVE FIRST
        StudyRoom createdStudyRoom = studyRoomRepository.save(studyRoom);
        System.out.println("Study room saved to DB");

        // ✅ THEN ADD PARTICIPANT
        createdStudyRoom.getParticipants().add(user);
        System.out.println("User added to participants");

        // ✅ SAVE RELATIONSHIP
        studyRoomRepository.saveAndFlush(createdStudyRoom);
        System.out.println("Participants saved");

        return ModelConversion.convertToSimpleStudyRoomDTO(createdStudyRoom);
    }


    public StudyRoomDTO joinStudyRoom(JoinRoomRequestDTO requestDetails) {
        StudyRoom studyRoom = studyRoomRepository.findByRoomCode(requestDetails.getRoomCode())
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        User user = userRepository.findById(requestDetails.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(studyRoom.getParticipants().contains(user)){
            throw new UserAlreadyJoinedException("User already joined the room");
        }

        studyRoom.getParticipants().add(user);
        user.getCreatedRooms().add(studyRoom);
        user.getJoinedRooms().add(studyRoom);
        
        return ModelConversion.convertToSimpleStudyRoomDTO(studyRoom);

    }


    public Set<UserDTO> getParticipantsByRoomCode(String roomCode) {

        StudyRoom studyRoom = studyRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        Set<UserDTO> result = new HashSet<>();
        for(User user : studyRoom.getParticipants()){
            result.add(ModelConversion.convertToSimpleUserDTO(user));
        }

        return result;

    }

    public StudyRoomDTO getStudyRoomByCode(String roomCode) {

        StudyRoom studyRoom = studyRoomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        return ModelConversion.convertToSimpleStudyRoomDTO(studyRoom);
    }
}
