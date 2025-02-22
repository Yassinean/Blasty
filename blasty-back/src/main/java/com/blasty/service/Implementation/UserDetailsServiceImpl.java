package com.blasty.service.Implementation;

import com.blasty.model.User;
import com.blasty.repository.UserRepository;
import com.blasty.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(identifier)
                .orElseGet(()-> userRepository.findByPhone(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé")));
        return new CustomUserDetails(user);
    }
}
