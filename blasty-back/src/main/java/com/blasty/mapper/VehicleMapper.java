package com.blasty.mapper;

import com.blasty.dto.request.VehicleRequest;
import com.blasty.dto.response.VehicleResponse;
import com.blasty.model.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    Vehicle toEntity(VehicleRequest vehicleRequest);

    @Mapping(target = "clientId", source = "client.id")
    VehicleResponse toResponse(Vehicle vehicle);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client", ignore = true)
    default void updateEntity(@MappingTarget Vehicle entity, VehicleRequest dto) {
        if (dto.getImmatriculation() != null) {
            entity.setImmatriculation(dto.getImmatriculation());
        }
        if (dto.getType() != null) {
            entity.setType(dto.getType());
        }
    }

}
