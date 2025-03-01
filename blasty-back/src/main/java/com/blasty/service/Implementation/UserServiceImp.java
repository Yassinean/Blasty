package com.blasty.service.Implementation;

import com.blasty.exception.IncorrectPasswordException;
import com.blasty.exception.InvalidPasswordException;
import com.blasty.exception.UserNotFoundException;
import com.blasty.mapper.AdminMapper;
import com.blasty.mapper.ClientMapper;
import com.blasty.model.Admin;
import com.blasty.model.enums.UserRole;
import com.blasty.repository.AdminRepository;
import com.blasty.repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blasty.dto.request.RegisterRequest;
import com.blasty.dto.response.UserResponse;
import com.blasty.model.Client;
import com.blasty.model.User;
import com.blasty.repository.UserRepository;
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
    private final UserRepository userRepository;

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

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
//        // Recherche de l'utilisateur par email ou téléphone
//        User user = adminRepository.findByEmail(username)
//                .orElse(clientRepository.findByPhone(username)
//                        .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé")));
//
//        // Vérification que l'ancien mot de passe est correct
//        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
//            throw new IncorrectPasswordException("Ancien mot de passe incorrect");
//        }
//
//        // Validation du nouveau mot de passe (par exemple, vous pouvez vérifier des règles de complexité ici)
//        if (newPassword.equals(oldPassword)) {
//            throw new InvalidPasswordException("Le nouveau mot de passe doit être différent de l'ancien");
//        }
//
//        // Encryptage du nouveau mot de passe et mise à jour
//        user.setPassword(passwordEncoder.encode(newPassword));
//
//        // Sauvegarde de l'utilisateur avec le nouveau mot de passe
//        userRepository.save(user);
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
