package com.studyroom.backend.repository.mysql;


import com.studyroom.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsById(Long id);

    Boolean existsByEmail(String email);

}
