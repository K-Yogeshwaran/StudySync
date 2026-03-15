package com.studyroom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    private String name;

    private String email;

    private Set<StudyRoomDTO> createdRooms;

    private Set<StudyRoomDTO> joinedRooms;
}
