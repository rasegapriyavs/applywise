package com.rasegapriya.placementsystem.dto;

import com.rasegapriya.placementsystem.model.User;

import java.time.Instant;

public record UserResponse(Long id, String fullName, String email, Instant createdAt, Instant updatedAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
