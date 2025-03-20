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
import java.util.HashMap;
import java.util.Map;

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
        String userId;

        if (user instanceof Admin) {
            Admin admin = (Admin) user;
            username = ((Admin) user).getEmail();
            role = "ADMIN";
            userId = String.valueOf(admin.getId());
        } else {
            Client client = (Client) user;
            username = ((Client) user).getPhone();
            role = "CLIENT";
            userId = String.valueOf(client.getId());
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
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
        } catch (SignatureException e) {
            // Invalid signature
            return false;
        } catch (MalformedJwtException e) {
            // Invalid token format
            return false;
        } catch (ExpiredJwtException e) {
            // Token expired
            return false;
        } catch (UnsupportedJwtException e) {
            // Unsupported token
            return false;
        } catch (IllegalArgumentException e) {
            // Token is empty or null
            return false;
        }
    }

    public String refreshToken(User user) {
        String username;
        String role;
        String userId;

        if (user instanceof Admin) {
            Admin admin = (Admin) user;
            username = admin.getEmail();
            role = "ADMIN";
            userId = String.valueOf(admin.getId());
        } else {
            Client client = (Client) user;
            username = client.getPhone();
            role = "CLIENT";
            userId = String.valueOf(client.getId());
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime * 2))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
