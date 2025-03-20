package com.blasty.service.Interface;

import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.response.UserResponse;
import com.blasty.model.User;

public interface UserService {

    UserResponse registerClient(RegisterRequest request);

    UserResponse authenticateClient(String phone, String password);

    UserResponse authenticateAdmin(String email, String password);
}
