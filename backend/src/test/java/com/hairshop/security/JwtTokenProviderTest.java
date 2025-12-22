package com.hairshop.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        String secret = "test-secret-key-for-testing-minimum-256-bits-required-for-security-purposes-in-jwt-token";
        long accessTokenExpiration = 86400000L; // 24 hours
        long refreshTokenExpiration = 604800000L; // 7 days

        jwtTokenProvider = new JwtTokenProvider(secret, accessTokenExpiration, refreshTokenExpiration);
    }

    @Test
    @DisplayName("Access Token 생성")
    void createAccessToken() {
        // Given
        Long userId = 1L;
        String email = "test@example.com";
        String role = "CUSTOMER";

        // When
        String token = jwtTokenProvider.createAccessToken(userId, email, role);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("Refresh Token 생성")
    void createRefreshToken() {
        // Given
        Long userId = 1L;

        // When
        String token = jwtTokenProvider.createRefreshToken(userId);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("토큰에서 사용자 ID 추출")
    void getUserIdFromToken() {
        // Given
        Long userId = 1L;
        String token = jwtTokenProvider.createAccessToken(userId, "test@example.com", "CUSTOMER");

        // When
        Long extractedUserId = jwtTokenProvider.getUserIdFromToken(token);

        // Then
        assertThat(extractedUserId).isEqualTo(userId);
    }

    @Test
    @DisplayName("토큰에서 이메일 추출")
    void getEmailFromToken() {
        // Given
        String email = "test@example.com";
        String token = jwtTokenProvider.createAccessToken(1L, email, "CUSTOMER");

        // When
        String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

        // Then
        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("토큰에서 역할 추출")
    void getRoleFromToken() {
        // Given
        String role = "CUSTOMER";
        String token = jwtTokenProvider.createAccessToken(1L, "test@example.com", role);

        // When
        String extractedRole = jwtTokenProvider.getRoleFromToken(token);

        // Then
        assertThat(extractedRole).isEqualTo(role);
    }

    @Test
    @DisplayName("유효한 토큰 검증 - 성공")
    void validateTokenSuccess() {
        // Given
        String token = jwtTokenProvider.createAccessToken(1L, "test@example.com", "CUSTOMER");

        // When
        boolean isValid = jwtTokenProvider.validateToken(token);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("유효하지 않은 토큰 검증 - 실패")
    void validateTokenFailure() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        boolean isValid = jwtTokenProvider.validateToken(invalidToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("토큰 만료 여부 확인 - 만료되지 않음")
    void isTokenExpiredFalse() {
        // Given
        String token = jwtTokenProvider.createAccessToken(1L, "test@example.com", "CUSTOMER");

        // When
        boolean isExpired = jwtTokenProvider.isTokenExpired(token);

        // Then
        assertThat(isExpired).isFalse();
    }
}
