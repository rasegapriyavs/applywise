package com.rasegapriya.placementsystem.security;

import com.rasegapriya.placementsystem.model.User;

public record AuthenticatedUser(Long id, String fullName, String email) {

    public static AuthenticatedUser from(User user) {
        return new AuthenticatedUser(user.getId(), user.getFullName(), user.getEmail());
    }
}
