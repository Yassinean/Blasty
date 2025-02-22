package com.blasty.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email(message = "L'email doit être valide")
    private String email; // Pour Admin

    private String phone; // Pour Client

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}