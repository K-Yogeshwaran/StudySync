package com.studyroom.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class  CreateRoomRequestDTO {
    private Long createrUserId;
    private String roomName;
    private String description;
}
