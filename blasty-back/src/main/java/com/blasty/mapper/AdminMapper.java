package com.blasty.mapper;

import com.blasty.dto.response.UserResponse;
import com.blasty.model.Admin;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    UserResponse toResponse(Admin admin);
}

