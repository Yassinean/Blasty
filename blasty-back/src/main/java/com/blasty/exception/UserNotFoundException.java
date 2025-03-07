package com.blasty.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String utilisateurNonTrouvé) {
        super(utilisateurNonTrouvé);
    }
}
