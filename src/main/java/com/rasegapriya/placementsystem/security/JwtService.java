package com.rasegapriya.placementsystem.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.rasegapriya.placementsystem.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Component
public class JwtService {

    public static final String ISSUER = "placement-system";
    public static final String COOKIE_NAME = "APPLYWISE_AUTH";

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final Duration tokenLifetime;

    public JwtService(
            @Value("${app.jwt.secret}") String encodedSecret,
            @Value("${app.jwt.expiration-minutes:15}") long expirationMinutes) {
        if (encodedSecret == null || encodedSecret.isBlank()) {
            throw new IllegalStateException("Set the JWT_SECRET environment variable before starting the API.");
        }
        byte[] secret;
        try {
            secret = Base64.getDecoder().decode(encodedSecret);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("JWT_SECRET must be a Base64-encoded secret.", exception);
        }
        if (secret.length < 32) {
            throw new IllegalStateException("JWT_SECRET must decode to at least 32 bytes.");
        }
        if (expirationMinutes < 1 || expirationMinutes > 1440) {
            throw new IllegalStateException("JWT_EXPIRATION_MINUTES must be between 1 and 1440.");
        }

        SecretKey key = new SecretKeySpec(secret, "HmacSHA256");
        encoder = new NimbusJwtEncoder(new ImmutableSecret<>(key));
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        jwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(ISSUER));
        decoder = jwtDecoder;
        tokenLifetime = Duration.ofMinutes(expirationMinutes);
    }

    public String createToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(user.getId().toString())
                .issuedAt(now)
                .expiresAt(now.plus(tokenLifetime))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public Jwt decode(String token) throws JwtException {
        return decoder.decode(token);
    }

    public Duration getTokenLifetime() {
        return tokenLifetime;
    }
}
