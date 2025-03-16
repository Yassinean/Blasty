package com.blasty.dto.request;

import com.blasty.model.enums.VehiculeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleRequest {

    @NotBlank(message = "Immatriculation is required")
    private String immatriculation;

    @NotNull(message = "Vehicle type is required")
    private VehiculeType type;
}
