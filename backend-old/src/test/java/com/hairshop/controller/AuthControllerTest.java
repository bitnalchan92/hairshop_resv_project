package com.hairshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hairshop.domain.user.entity.User;
import com.hairshop.domain.user.repository.UserRepository;
import com.hairshop.dto.request.LoginRequest;
import com.hairshop.dto.request.SignupRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /auth/signup - 회원가입 성공")
    void signupSuccess() throws Exception {
        // Given
        SignupRequest request = new SignupRequest(
                "test@example.com",
                "password123",
                "홍길동",
                "010-1234-5678",
                User.UserRole.CUSTOMER
        );

        // When & Then
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                .andExpect(jsonPath("$.user.name").value("홍길동"))
                .andExpect(jsonPath("$.user.role").value("CUSTOMER"));
    }

    @Test
    @DisplayName("POST /auth/signup - 회원가입 실패 (이메일 중복)")
    void signupFailDuplicateEmail() throws Exception {
        // Given
        User existingUser = User.builder()
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .name("기존유저")
                .phone("010-9999-8888")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();
        userRepository.save(existingUser);

        SignupRequest request = new SignupRequest(
                "test@example.com",
                "password123",
                "홍길동",
                "010-1234-5678",
                User.UserRole.CUSTOMER
        );

        // When & Then
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /auth/signup - 회원가입 실패 (유효성 검증 오류)")
    void signupFailValidation() throws Exception {
        // Given
        SignupRequest request = new SignupRequest(
                "invalid-email",  // 잘못된 이메일 형식
                "123",            // 짧은 비밀번호
                "",               // 빈 이름
                "invalid-phone",  // 잘못된 전화번호
                User.UserRole.CUSTOMER
        );

        // When & Then
        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /auth/login - 로그인 성공")
    void loginSuccess() throws Exception {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .name("홍길동")
                .phone("010-1234-5678")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();
        userRepository.save(user);

        LoginRequest request = new LoginRequest("test@example.com", "password123");

        // When & Then
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    @DisplayName("POST /auth/login - 로그인 실패 (사용자 없음)")
    void loginFailUserNotFound() throws Exception {
        // Given
        LoginRequest request = new LoginRequest("notfound@example.com", "password123");

        // When & Then
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /auth/login - 로그인 실패 (비밀번호 틀림)")
    void loginFailWrongPassword() throws Exception {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .name("홍길동")
                .phone("010-1234-5678")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();
        userRepository.save(user);

        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /auth/logout - 로그아웃")
    void logout() throws Exception {
        // When & Then
        mockMvc.perform(post("/auth/logout"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("로그아웃되었습니다"));
    }
}
