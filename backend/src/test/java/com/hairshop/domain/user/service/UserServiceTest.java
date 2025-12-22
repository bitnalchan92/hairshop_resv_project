package com.hairshop.domain.user.service;

import com.hairshop.domain.user.entity.User;
import com.hairshop.domain.user.repository.UserRepository;
import com.hairshop.dto.request.LoginRequest;
import com.hairshop.dto.request.SignupRequest;
import com.hairshop.dto.response.AuthResponse;
import com.hairshop.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .name("홍길동")
                .phone("010-1234-5678")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();
    }

    @Test
    @DisplayName("회원가입 성공")
    void signupSuccess() {
        // Given
        SignupRequest request = new SignupRequest(
                "test@example.com",
                "password123",
                "홍길동",
                "010-1234-5678",
                User.UserRole.CUSTOMER
        );

        given(userRepository.existsByEmail(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("encodedPassword");
        given(userRepository.save(any(User.class))).willReturn(testUser);
        given(jwtTokenProvider.createAccessToken(any(), anyString(), anyString())).willReturn("accessToken");
        given(jwtTokenProvider.createRefreshToken(any())).willReturn("refreshToken");

        // When
        AuthResponse response = userService.signup(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("accessToken");
        assertThat(response.getRefreshToken()).isEqualTo("refreshToken");
        assertThat(response.getUser().getEmail()).isEqualTo("test@example.com");

        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복")
    void signupFailDuplicateEmail() {
        // Given
        SignupRequest request = new SignupRequest(
                "test@example.com",
                "password123",
                "홍길동",
                "010-1234-5678",
                User.UserRole.CUSTOMER
        );

        given(userRepository.existsByEmail(anyString())).willReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.signup(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이미 사용 중인 이메일입니다");

        verify(userRepository).existsByEmail("test@example.com");
    }

    @Test
    @DisplayName("로그인 성공")
    void loginSuccess() {
        // Given
        LoginRequest request = new LoginRequest("test@example.com", "password123");

        given(userRepository.findByEmailAndDeletedAtIsNull(anyString())).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches(anyString(), anyString())).willReturn(true);
        given(jwtTokenProvider.createAccessToken(any(), anyString(), anyString())).willReturn("accessToken");
        given(jwtTokenProvider.createRefreshToken(any())).willReturn("refreshToken");

        // When
        AuthResponse response = userService.login(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("accessToken");
        assertThat(response.getRefreshToken()).isEqualTo("refreshToken");

        verify(userRepository).findByEmailAndDeletedAtIsNull("test@example.com");
        verify(passwordEncoder).matches("password123", "encodedPassword");
    }

    @Test
    @DisplayName("로그인 실패 - 사용자 없음")
    void loginFailUserNotFound() {
        // Given
        LoginRequest request = new LoginRequest("notfound@example.com", "password123");

        given(userRepository.findByEmailAndDeletedAtIsNull(anyString())).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이메일 또는 비밀번호가 올바르지 않습니다");

        verify(userRepository).findByEmailAndDeletedAtIsNull("notfound@example.com");
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void loginFailWrongPassword() {
        // Given
        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");

        given(userRepository.findByEmailAndDeletedAtIsNull(anyString())).willReturn(Optional.of(testUser));
        given(passwordEncoder.matches(anyString(), anyString())).willReturn(false);

        // When & Then
        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이메일 또는 비밀번호가 올바르지 않습니다");

        verify(userRepository).findByEmailAndDeletedAtIsNull("test@example.com");
        verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
    }

    @Test
    @DisplayName("사용자 조회 성공")
    void getUserByIdSuccess() {
        // Given
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));

        // When
        var response = userService.getUserById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("test@example.com");

        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("토큰 갱신 성공")
    void refreshTokenSuccess() {
        // Given
        String refreshToken = "validRefreshToken";

        given(jwtTokenProvider.validateToken(anyString())).willReturn(true);
        given(jwtTokenProvider.getUserIdFromToken(anyString())).willReturn(1L);
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        given(jwtTokenProvider.createAccessToken(any(), anyString(), anyString())).willReturn("newAccessToken");
        given(jwtTokenProvider.createRefreshToken(any())).willReturn("newRefreshToken");

        // When
        AuthResponse response = userService.refreshToken(refreshToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("newAccessToken");
        assertThat(response.getRefreshToken()).isEqualTo("newRefreshToken");

        verify(jwtTokenProvider).validateToken(refreshToken);
        verify(userRepository).findById(1L);
    }
}
