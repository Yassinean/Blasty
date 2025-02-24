package com.blasty.mapper;

import org.mapstruct.*;
import java.util.List;

public interface GenericMapper<RequestDTO, ResponseDTO, Entity> {

    /**
     * Convertit un DTO de requête en Entité.
     *
     * @param requestDTO Le DTO de requête à convertir.
     * @return L'entité correspondante.
     */
    Entity toEntity(RequestDTO requestDTO);

    /**
     * Convertit une Entité en DTO de réponse.
     *
     * @param entity L'entité à convertir.
     * @return Le DTO de réponse correspondant.
     */
    ResponseDTO toResponse(Entity entity);

    /**
     * Convertit une liste d'entités en une liste de DTOs de réponse.
     *
     * @param entities La liste d'entités à convertir.
     * @return La liste de DTOs de réponse correspondante.
     */
    List<ResponseDTO> toResponseList(List<Entity> entities);

    /**
     * Met à jour une entité existante avec les données d'un DTO de requête.
     *
     * @param requestDTO Le DTO de requête contenant les nouvelles données.
     * @param entity     L'entité à mettre à jour.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(RequestDTO requestDTO, @MappingTarget Entity entity);
}