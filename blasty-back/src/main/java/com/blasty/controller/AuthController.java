package com.blasty.controller;

import com.blasty.dto.request.LoginRequest;
import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.request.TokenRequest;
import com.blasty.dto.response.JwtResponse;
import com.blasty.model.Admin;
import com.blasty.model.Client;
import com.blasty.model.User;
import com.blasty.model.enums.UserRole;
import com.blasty.repository.AdminRepository;
import com.blasty.repository.ClientRepository;
import com.blasty.security.JwtUtil;

import com.blasty.service.Implementation.JwtTokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JwtTokenBlacklistService tokenBlacklistService;

    // 🔹 1. Connexion (Admin avec email, Client avec téléphone)
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication;
            User user;

            if (request.getEmail() != null) {
                // Authentification Admin
                Admin admin = adminRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("Admin non trouvé"));

                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                user = admin;
            } else {
                // Authentification Client
                Client client = clientRepository.findByPhone(request.getPhone())
                        .orElseThrow(() -> new UsernameNotFoundException("Client non trouvé"));

                if (!passwordEncoder.matches(request.getPassword(), client.getPassword())) {
                    throw new BadCredentialsException("Mot de passe incorrect");
                }

                authentication = new UsernamePasswordAuthenticationToken(client.getPhone(), null);
                user = client;
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.refreshToken(user);
            String userId;
            Map<String, Object> userData = new HashMap<>();

            if (user instanceof Admin) {
                Admin admin = (Admin) user;
                userId = String.valueOf(admin.getId());
                userData.put("email", admin.getEmail());
            } else {
                Client client = (Client) user;
                userId = String.valueOf(client.getId());
//                userData.put("phone", client.getPhone());
                userData.put("name", client.getName());
            }
            userData.put("id", userId);

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
        if (clientRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest()
                    .body(new JwtResponse("Numéro de téléphone déjà utilisé", true));
        }

        Client newClient = Client.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        clientRepository.save(newClient);
        String token = jwtUtil.generateToken(newClient);
        String refreshToken = jwtUtil.refreshToken(newClient);

        return ResponseEntity.ok(new JwtResponse(token, refreshToken, "Client enregistré avec succès"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
            return ResponseEntity.ok().body("Logged out successfully");
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }

    // 🔹 3. Rafraîchissement du Token
//    @PostMapping("/refresh")
//    public ResponseEntity<JwtResponse> refreshToken(@RequestBody TokenRequest tokenRequest) {
//        try {
//            String username = jwtUtil.extractUsername(tokenRequest.getRefreshToken());
//            User user = adminRepository.findByEmail(username)
//                    .orElse(clientRepository.findByPhone(username)
//                            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé")));
//
//            String newToken = jwtUtil.generateToken(user);
//            String newRefreshToken = jwtUtil.refreshToken(user);
//
//            return ResponseEntity.ok(new JwtResponse(newToken, newRefreshToken, "Token rafraîchi avec succès"));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(new JwtResponse("Token de rafraîchissement invalide", true));
//        }
//    }
}