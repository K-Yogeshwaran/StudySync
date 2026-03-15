package com.studyroom.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "study_rooms")
public class StudyRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomName;

    @Column(unique = true , nullable = false)
    private String roomCode;


    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by" , nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private User createdBy;

    private LocalDateTime createdAt;

    public StudyRoom(String roomName, String roomCode, String description, User createdBy, LocalDateTime createdAt, Set<User> participants) {
        this.roomName = roomName;
        this.roomCode = roomCode;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.participants = participants;
    }

    @ManyToMany
    @JoinTable(
            name = "room_participants",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @ToString.Exclude
    @JsonIgnore
    private Set<User> participants;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StudyRoom)) return false;
        StudyRoom room = (StudyRoom) o;
        return id != null && id.equals(room.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
