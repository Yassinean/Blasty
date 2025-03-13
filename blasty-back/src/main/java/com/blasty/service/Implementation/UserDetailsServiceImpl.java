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
        Admin admin = adminRepository.findByEmail(username).orElse(null);

        if (admin != null) {
            // If Admin is found, return CustomUserDetails for Admin
            return new CustomUserDetails(admin);
        }

        // If not found as Admin, try to find the user as Client
        Client client = clientRepository.findByPhone(username).orElse(null);

        if (client != null) {
            // If Client is found, return CustomUserDetails for Client
            return new CustomUserDetails(client);
        }

        // If neither Admin nor Client is found, throw UsernameNotFoundException
        throw new UsernameNotFoundException("User not found for username: " + username);
    }
}
