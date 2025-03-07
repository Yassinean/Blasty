package com.blasty.service.Implementation;

import com.blasty.model.Admin;
import com.blasty.model.Client;
import com.blasty.repository.AdminRepository;
import com.blasty.repository.ClientRepository;
import com.blasty.security.CustomUserDetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final ClientRepository clientRepository;

    public UserDetailsServiceImpl(AdminRepository adminRepository, ClientRepository clientRepository) {
        this.adminRepository = adminRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Vérifier si l'utilisateur est un admin
        Admin admin = adminRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("Admin non trouve"));

        if (admin != null) {
            return new CustomUserDetails(admin);
        }

        // Vérifier si l'utilisateur est un client
        Client client = clientRepository.findByPhone(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        return new CustomUserDetails(client);
    }
}
