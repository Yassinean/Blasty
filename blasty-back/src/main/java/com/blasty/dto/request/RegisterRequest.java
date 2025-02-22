package com.blasty.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String phone;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}
