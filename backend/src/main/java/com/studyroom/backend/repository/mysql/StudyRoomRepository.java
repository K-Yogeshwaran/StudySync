package com.studyroom.backend.repository.mysql;


import com.studyroom.backend.model.StudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyRoomRepository extends JpaRepository<StudyRoom, Long> {

    Optional<StudyRoom> findByRoomCode(String roomCode);

    Boolean existsByRoomCode(String roomCode);

    List<StudyRoom> findByCreatedBy_Id(Long UserId);

}
