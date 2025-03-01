package com.blasty.exception;

public class IncorrectPasswordException extends RuntimeException {
    public IncorrectPasswordException(String ancienMotDePasseIncorrect) {
        super(ancienMotDePasseIncorrect);
    }
}
