package com.blasty.service.Interface;

import com.blasty.dto.request.VehicleRequest;
import com.blasty.dto.response.VehicleResponse;

public interface VehicleService {
    VehicleResponse createVehicle(Long clientId, VehicleRequest requestDto);
    VehicleResponse getVehicleByClientId(Long clientId);
    VehicleResponse updateVehicleByClientId(Long clientId, VehicleRequest requestDto);
    void deleteVehicleByClientId(Long clientId);
    boolean existsByClientId(Long clientId);
}
