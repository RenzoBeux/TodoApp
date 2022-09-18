package com.renzobeux.todolist.auth;

import com.renzobeux.todolist.payload.request.LoginRequest;
import com.renzobeux.todolist.payload.request.SignupRequest;
import com.renzobeux.todolist.payload.request.TokenRefreshRequest;
import com.renzobeux.todolist.payload.response.JwtResponse;
import com.renzobeux.todolist.payload.response.MessageResponse;
import com.renzobeux.todolist.security.jwt.JwtUtils;
import com.renzobeux.todolist.user.User;
import com.renzobeux.todolist.user.UserDetailsImpl;
import com.renzobeux.todolist.user.UserRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@SecurityRequirements()
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    RefreshTokenService refreshTokenService;
    @CrossOrigin(allowCredentials = "true", origins = {"https://localhost:3000"})
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody @NotNull LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);
        refreshTokenService.deleteByUserId(userDetails.getId());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .path("/")
                .domain("localhost")
                .secure(true)
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new JwtResponse(jwt,
                refreshToken.getToken(),
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail()));
    }
    @CrossOrigin(allowCredentials = "true", origins = {"https://localhost:8080, https://localhost:3000"})
    @GetMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = true) String requestRefreshToken, HttpServletResponse response) {
        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
//                    if token is about to expire, generate a new one

                    RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
                    ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                            .httpOnly(true)
                            .path("/")
                            .domain("localhost")
                            .secure(true)
                            .maxAge(7 * 24 * 60 * 60)
                            .sameSite("None")
                            .build();

                    response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                    return ResponseEntity.ok(
                            new JwtResponse(token,
                                    refreshToken.getToken(),
                                    user.getId(),
                                    user.getUsername(),
                                    user.getEmail()));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!", -1));
    }

//    LOGOUT METHOD, CLEARS COOKIES
    @CrossOrigin(allowCredentials = "true", origins = {"https://localhost:8080, https://localhost:3000"})
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@CookieValue(name = "refreshToken", required = true) String requestRefreshToken, HttpServletResponse response) {
        Optional<RefreshToken> refreshToken = refreshTokenService.findByToken(requestRefreshToken);
        if (refreshToken.isPresent()) {
            refreshTokenService.deleteByUserId(refreshToken.get().getUser().getId());
        }
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .domain("localhost")
                .secure(true)
                .maxAge(0)
                .sameSite("None")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
    }




    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getEmail()
                );
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}