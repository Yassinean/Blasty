package com.blasty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blasty.model.User;
import com.blasty.security.JwtUtil;
import com.blasty.service.Interface.UserService;
import com.blasty.dto.request.ChangePasswordRequest;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // @GetMapping
    // public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String token) {
    //     String username = jwtUtil.extractUsername(token.substring(7));
    //     User user = userService.getUserByUsername(username);
    //     return ResponseEntity.ok(user);
    // }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestHeader("Authorization") String token, @RequestBody User updatedUser) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userService.updateUser(username, updatedUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordRequest request) {
        String username = jwtUtil.extractUsername(token.substring(7));
        userService.changePassword(username, request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Mot de passe mis à jour avec succès");
    }
}