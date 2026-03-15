package com.studyroom.backend.controller;

import com.studyroom.backend.dto.LoginRequestDTO;
import com.studyroom.backend.dto.RegisterRequestDTO;
import com.studyroom.backend.dto.UserDTO;
import com.studyroom.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public String home(){
        return "User Home Page";
    }

    @GetMapping("/all")
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId){
        UserDTO user = userService.getUserById(userId);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody RegisterRequestDTO registerDetails){
        System.out.println("Register api called");
        UserDTO user = userService.registerUser(registerDetails);

        return ResponseEntity.ok(user);
    }



    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody LoginRequestDTO loginDetails){

        UserDTO user = userService.loginUser(loginDetails);

        return ResponseEntity.ok(user);
    }


}
