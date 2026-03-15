package com.studyroom.backend.service;

import com.studyroom.backend.dto.LoginRequestDTO;
import com.studyroom.backend.dto.RegisterRequestDTO;
import com.studyroom.backend.dto.UserDTO;
import com.studyroom.backend.exception.InvalidPasswordException;
import com.studyroom.backend.exception.UserAlreadyExistException;
import com.studyroom.backend.exception.UserNotFoundException;
import com.studyroom.backend.model.User;
import com.studyroom.backend.repository.mysql.UserRepository;
import com.studyroom.backend.utils.ModelConversion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public List<UserDTO> getAllUsers() {
        List<User> users =  userRepository.findAll();
        List<UserDTO> userDTOS = new ArrayList<>();
        for(User user : users){
            userDTOS.add(ModelConversion.convertToSimpleUserDTO(user));
        }
        return userDTOS;
    }


    public UserDTO registerUser(RegisterRequestDTO registerDetails) {
        User user = new User(
                registerDetails.getName() ,
                registerDetails.getEmail() ,
                passwordEncoder.encode(registerDetails.getPassword()),
                new HashSet<> ());

        Boolean isUserExist = userRepository.existsByEmail(registerDetails.getEmail());
        if(isUserExist){
            throw new UserAlreadyExistException("User already exists");
        }

        User newUser = userRepository.save(user);
        return ModelConversion.convertToSimpleUserDTO(newUser);
    }

    public UserDTO loginUser(LoginRequestDTO loginDetails){

        User user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(!passwordEncoder.matches(loginDetails.getPassword() , user.getPassword())){
            throw new InvalidPasswordException("Incorrect password");
        }

        return ModelConversion.convertToSimpleUserDTO(user);
    }

    public UserDTO getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return ModelConversion.convertToUserDTO(user);
    }
}
