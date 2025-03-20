package com.blasty.service.Implementation;

import com.blasty.mapper.AdminMapper;
import com.blasty.mapper.ClientMapper;
import com.blasty.model.Admin;
import com.blasty.repository.AdminRepository;
import com.blasty.repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.response.UserResponse;
import com.blasty.model.Client;
import com.blasty.model.User;
import com.blasty.service.Interface.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserResponse registerClient(RegisterRequest request) {
        if (clientRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Numéro déjà utilisé");
        }

        Client client = clientMapper.toEntity(request);
        client.setPassword(passwordEncoder.encode(request.getPassword()));

        Client savedUser = clientRepository.save(client);
        return clientMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse authenticateClient(String phone, String password) {
        Client user = clientRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return clientMapper.toResponse(user);
    }

    @Override
    public UserResponse authenticateAdmin(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return adminMapper.toResponse(admin);
    }

}
