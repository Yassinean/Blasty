package com.blasty.service.Implementation;

import com.blasty.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtTokenBlacklistService {
    // Using a simple in-memory set to store blacklisted tokens
    // For production, consider using Redis or another distributed cache
    private final Set<String> blacklistedTokens = Collections.synchronizedSet(new HashSet<>());
    private final JwtUtil jwtUtil;

    /**
     * Blacklist a JWT token
     * @param token The JWT token to blacklist
     */
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
        log.info("Token added to blacklist");

        // Optional: Schedule cleanup of expired tokens
        cleanupExpiredTokens();
    }

    /**
     * Check if a token is blacklisted
     * @param token The JWT token to check
     * @return true if the token is blacklisted, false otherwise
     */
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    /**
     * Remove expired tokens from the blacklist
     * This helps prevent the blacklist from growing too large
     */
    private void cleanupExpiredTokens() {
        Iterator<String> iterator = blacklistedTokens.iterator();
        while (iterator.hasNext()) {
            String token = iterator.next();
            if (jwtUtil.isTokenExpired(token)) {
                iterator.remove();
                log.debug("Removed expired token from blacklist");
            }
        }
    }
}