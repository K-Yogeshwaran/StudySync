package com.studyroom.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    @OneToMany(mappedBy = "createdBy" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    private Set<StudyRoom> createdRooms;

    @ManyToMany(mappedBy = "participants")
    @ToString.Exclude
    @JsonIgnore
    private Set<StudyRoom> joinedRooms;

    public User(String name , String email , String password , Set<StudyRoom> createdRooms){
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdRooms = createdRooms;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
