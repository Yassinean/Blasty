package com.blasty.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.blasty.model.Admin;
import com.blasty.model.Client;
import com.blasty.model.User;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(User user) {
        String username;
        String role;

        if (user instanceof Admin) {
            username = ((Admin) user).getEmail();
            role = "ADMIN";
        } else {
            username = ((Client) user).getPhone();
            role = "CLIENT";
        }
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Ajouter le rôle dans le token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String extractRole(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String refreshToken(User user) {
        String username;
        if (user instanceof Admin) {
            username = ((Admin) user).getEmail();
        } else {
            username = ((Client) user).getPhone();
        }
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime * 2)) // Durée plus longue
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
