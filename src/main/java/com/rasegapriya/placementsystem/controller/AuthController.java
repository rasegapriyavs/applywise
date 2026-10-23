package com.rasegapriya.placementsystem.controller;

import com.rasegapriya.placementsystem.dto.AuthResponse;
import com.rasegapriya.placementsystem.dto.CsrfResponse;
import com.rasegapriya.placementsystem.dto.LoginRequest;
import com.rasegapriya.placementsystem.dto.RegisterRequest;
import com.rasegapriya.placementsystem.dto.UserResponse;
import com.rasegapriya.placementsystem.model.User;
import com.rasegapriya.placementsystem.security.JwtService;
import com.rasegapriya.placementsystem.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final boolean secureCookies;

    public AuthController(
            AuthService authService,
            JwtService jwtService,
            @Value("${app.jwt.cookie-secure:false}") boolean secureCookies) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.secureCookies = secureCookies;
    }

    @GetMapping("/csrf")
    public CsrfResponse csrfToken(CsrfToken csrfToken) {
        return new CsrfResponse(csrfToken.getToken());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        User user = authService.register(request);
        addAuthenticationCookie(response, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(UserResponse.from(user)));
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        User user = authService.authenticate(request);
        addAuthenticationCookie(response, user);
        return new AuthResponse(UserResponse.from(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(JwtService.COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/api")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }

    private void addAuthenticationCookie(HttpServletResponse response, User user) {
        ResponseCookie cookie = ResponseCookie.from(JwtService.COOKIE_NAME, jwtService.createToken(user))
                .httpOnly(true)
                .secure(secureCookies)
                .sameSite("Lax")
                .path("/api")
                .maxAge(jwtService.getTokenLifetime())
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
