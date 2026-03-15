package com.studyroom.backend.controller;


import com.studyroom.backend.dto.CreateRoomRequestDTO;
import com.studyroom.backend.dto.JoinRoomRequestDTO;
import com.studyroom.backend.dto.StudyRoomDTO;
import com.studyroom.backend.dto.UserDTO;
import com.studyroom.backend.service.StudyRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/studyRoom")
@CrossOrigin("*")
public class StudyRoomController {

    @Autowired
    private StudyRoomService studyRoomService;

    @PostMapping("/create")
    public ResponseEntity<StudyRoomDTO> createStudyRoom(@RequestBody CreateRoomRequestDTO roomDetails){
        System.out.println("Controller hitted");
        StudyRoomDTO studyRoomDTO = studyRoomService.createStudyRoom(roomDetails);

        return ResponseEntity.ok(studyRoomDTO);
    }

    @PostMapping("/join")
    public ResponseEntity<StudyRoomDTO> joinStudyRoom(@RequestBody JoinRoomRequestDTO requestDetails){
        StudyRoomDTO studyRoomDTO = studyRoomService.joinStudyRoom(requestDetails);

        return ResponseEntity.ok(studyRoomDTO);
    }


    @GetMapping("/participants/{roomCode}")
    public ResponseEntity<Set<UserDTO>> getParticipantsByRoomCode(@PathVariable String roomCode){

        Set<UserDTO> participants = studyRoomService.getParticipantsByRoomCode(roomCode);
        return ResponseEntity.ok(participants);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<StudyRoomDTO> getStudyRoomByCode(@PathVariable String roomCode){
        StudyRoomDTO studyRoomDTO = studyRoomService.getStudyRoomByCode(roomCode);
        return ResponseEntity.ok(studyRoomDTO);
    }

}
