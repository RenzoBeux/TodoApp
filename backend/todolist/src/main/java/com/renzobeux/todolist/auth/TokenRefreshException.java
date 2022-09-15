package com.renzobeux.todolist.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
@ResponseStatus(HttpStatus.FORBIDDEN)
public class TokenRefreshException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private long userId;
    public TokenRefreshException(String token, String message, long userId) {
        super(String.format("Failed for [%s]: %s", token, message));
        this.userId = userId;
    }
    public long getUserId() {
        return userId;
    }
}