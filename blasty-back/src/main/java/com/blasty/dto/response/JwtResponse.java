package com.blasty.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String refreshToken;
    private String message;
    
    public JwtResponse(String token) {
        this.token = token;
    }
    
    public JwtResponse(String message, boolean isError) {
        this.message = message;
    }
}