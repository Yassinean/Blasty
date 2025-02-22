package com.blasty.controller;

import com.blasty.dto.request.LoginRequest;
import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.request.TokenRequest;
import com.blasty.dto.response.JwtResponse;
import com.blasty.model.User;
import com.blasty.model.enums.UserRole;
import com.blasty.repository.UserRepository;
import com.blasty.security.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 🔹 1. Connexion (Admin avec email, Client avec téléphone)
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication;
            User user;

            if (request.getEmail() != null) {
                // Authentification Admin
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                user = userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("Admin non trouvé"));
            } else {
                // Authentification Client
                user = userRepository.findByPhone(request.getPhone())
                        .orElseThrow(() -> new UsernameNotFoundException("Client non trouvé"));
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    throw new BadCredentialsException("Mot de passe incorrect");
                }

                authentication = new UsernamePasswordAuthenticationToken(user.getPhone(), null);
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.refreshToken(user);

            return ResponseEntity.ok(new JwtResponse(token, refreshToken, "Connexion réussie"));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new JwtResponse("Identifiants invalides", true));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse("Utilisateur non trouvé", true));
        }
    }

    // 🔹 2. Inscription (Seulement pour les clients)
    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest()
                    .body(new JwtResponse("Numéro de téléphone déjà utilisé", true));
        }

        User newUser = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CLIENT)
                .build();

        userRepository.save(newUser);
        String token = jwtUtil.generateToken(newUser);
        String refreshToken = jwtUtil.refreshToken(newUser);

        return ResponseEntity.ok(new JwtResponse(token, refreshToken, "Client enregistré avec succès"));
    }

    // 🔹 3. Rafraîchissement du Token
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody TokenRequest tokenRequest) {
        try {
            String username = jwtUtil.extractUsername(tokenRequest.getRefreshToken());
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
            
            String newToken = jwtUtil.generateToken(user);
            String newRefreshToken = jwtUtil.refreshToken(user);
            
            return ResponseEntity.ok(new JwtResponse(newToken, newRefreshToken, "Token rafraîchi avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new JwtResponse("Token de rafraîchissement invalide", true));
        }
    }
}