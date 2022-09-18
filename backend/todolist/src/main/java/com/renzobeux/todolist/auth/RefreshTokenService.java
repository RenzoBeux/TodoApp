package com.renzobeux.todolist.auth;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import com.renzobeux.todolist.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {
    @Value("${todo.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserRepository userRepository;
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUsed(false);
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }
    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        //If the token is used the TokenControllerAdvice will delete it
        if(token.getUsed()) {
            throw new TokenRefreshException(token.getToken(),"Refresh token is already used, please make a new signin request", token.getUser().getId());
        }
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request", token.getUser().getId());
        }
        token.setUsed(true);
        refreshTokenRepository.save(token);
        return token;
    }

    @Transactional
    public Integer deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}