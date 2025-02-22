package com.blasty.service.Implementation;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.response.UserResponse;
import com.blasty.mapper.UserMapper;
import com.blasty.model.Client;
import com.blasty.model.User;
import com.blasty.model.enums.UserRole;
import com.blasty.repository.ClientRepository;
import com.blasty.repository.UserRepository;
import com.blasty.service.Interface.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerClient(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Numéro déjà utilisé");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CLIENT);
        User savedUser = userRepository.save(user);

        Client client = new Client();
        client.setUserId(savedUser.getId());
        clientRepository.save(client);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse authenticateClient(String phone, String password) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse authenticateAdmin(String email, String password) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        return userMapper.toResponse(admin);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // @Override
    public User updateUser(String username, User updatedUser) {
        return null;
        // User user = getUserByUsername(username);
        // user.setName(updatedUser.getName());
        // user.setPhone(updatedUser.getPhone());
        // return userRepository.save(user);
    }

}
