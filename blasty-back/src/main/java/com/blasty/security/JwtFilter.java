package com.blasty.security;

import com.blasty.service.Implementation.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
//@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                try {
                    username = jwtUtil.extractUsername(token);
                } catch (ExpiredJwtException e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expiré");
                    return;
                }
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.info("Authenticating user: {}", username);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                String role = jwtUtil.extractRole(token);
                log.info("User role: {}", role);

                if (jwtUtil.validateToken(token)) {
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + role));
                    log.info("Granted authorities: {}", authorities);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            chain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Erreur d'authentification", e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Erreur d'authentification");
        }
    }
}