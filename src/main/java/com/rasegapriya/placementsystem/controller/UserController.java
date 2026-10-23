package com.rasegapriya.placementsystem.controller;

import com.rasegapriya.placementsystem.dto.PasswordChangeRequest;
import com.rasegapriya.placementsystem.dto.ProfileUpdateRequest;
import com.rasegapriya.placementsystem.dto.UserResponse;
import com.rasegapriya.placementsystem.security.AuthenticatedUser;
import com.rasegapriya.placementsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getProfile(@AuthenticationPrincipal AuthenticatedUser user) {
        return UserResponse.from(userService.getProfile(user.id()));
    }

    @PutMapping
    public UserResponse updateProfile(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return UserResponse.from(userService.updateProfile(user.id(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(user.id(), request);
        return ResponseEntity.noContent().build();
    }
}
