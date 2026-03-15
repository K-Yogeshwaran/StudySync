package com.studyroom.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudyRoomDTO {
    private Long id;
    private String roomName;
    private String roomCode;
    private String description;
    private Long createrId;
    private LocalDateTime createdAt;
    private Set<UserDTO> participants;
}
