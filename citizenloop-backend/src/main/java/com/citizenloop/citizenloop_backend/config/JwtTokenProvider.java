package com.citizenloop.citizenloop_backend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.Properties;

@Component
public class JwtTokenProvider {

    private final SecretKey key;

    @Value("${jwt.expiration:3600000}") // default 1 hour
    private long jwtExpiration;

    public JwtTokenProvider(@Value("${jwt.secret:}") String jwtSecret) {
        SecretKey tempKey;

        if (jwtSecret == null || jwtSecret.isEmpty()) {
            System.out.println("INFO: No JWT secret found. Generating a new secure key...");
            tempKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);

            // Save the key automatically to application.properties
            saveSecretToProperties(tempKey);
        } else {
            try {
                tempKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
            } catch (IllegalArgumentException e) {
                System.out.println("WARNING: Invalid JWT secret. Generating a new secure key...");
                tempKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
                saveSecretToProperties(tempKey);
            }
        }
        this.key = tempKey;
    }

    private void saveSecretToProperties(SecretKey secretKey) {
        String encoded = Base64.getEncoder().encodeToString(secretKey.getEncoded());
        try {
            Properties props = new Properties();
            props.load(JwtTokenProvider.class.getClassLoader()
                    .getResourceAsStream("application.properties"));

            props.setProperty("jwt.secret", encoded);

            try (FileOutputStream out = new FileOutputStream("src/main/resources/application.properties")) {
                props.store(out, "Updated JWT secret automatically");
                System.out.println("INFO: JWT secret saved to application.properties");
            }
        } catch (IOException e) {
            System.out.println("ERROR: Failed to save JWT secret: " + e.getMessage());
        }
    }

    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
