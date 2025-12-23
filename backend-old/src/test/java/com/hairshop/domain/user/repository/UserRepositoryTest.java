package com.hairshop.domain.user.repository;

import com.hairshop.domain.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("사용자 저장 및 조회")
    void saveAndFindUser() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .password("password123")
                .name("홍길동")
                .phone("010-1234-5678")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
        assertThat(savedUser.getName()).isEqualTo("홍길동");
    }

    @Test
    @DisplayName("이메일로 사용자 찾기")
    void findByEmail() {
        // Given
        User user = createUser("test@example.com", "홍길동");
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("존재하지 않는 이메일로 사용자 찾기")
    void findByEmailNotFound() {
        // When
        Optional<User> found = userRepository.findByEmail("notfound@example.com");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("이메일 중복 체크 - 존재함")
    void existsByEmailTrue() {
        // Given
        User user = createUser("test@example.com", "홍길동");
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("이메일 중복 체크 - 존재하지 않음")
    void existsByEmailFalse() {
        // When
        boolean exists = userRepository.existsByEmail("notfound@example.com");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("전화번호로 사용자 찾기")
    void findByPhone() {
        // Given
        User user = createUser("test@example.com", "홍길동");
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByPhone("010-1234-5678");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getPhone()).isEqualTo("010-1234-5678");
    }

    @Test
    @DisplayName("OAuth 제공자와 ID로 사용자 찾기")
    void findByOauthProviderAndOauthId() {
        // Given
        User user = User.builder()
                .email("kakao@example.com")
                .password("password123")
                .name("카카오유저")
                .phone("010-9999-8888")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.KAKAO)
                .oauthId("kakao_12345")
                .build();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByOauthProviderAndOauthId(
                User.OAuthProvider.KAKAO, "kakao_12345");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getOauthProvider()).isEqualTo(User.OAuthProvider.KAKAO);
        assertThat(found.get().getOauthId()).isEqualTo("kakao_12345");
    }

    @Test
    @DisplayName("삭제되지 않은 사용자만 조회")
    void findByEmailAndDeletedAtIsNull() {
        // Given
        User user = createUser("test@example.com", "홍길동");
        userRepository.save(user);

        // 사용자 삭제
        user.delete();
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmailAndDeletedAtIsNull("test@example.com");

        // Then
        assertThat(found).isEmpty();
    }

    // Helper method
    private User createUser(String email, String name) {
        return User.builder()
                .email(email)
                .password("password123")
                .name(name)
                .phone("010-1234-5678")
                .role(User.UserRole.CUSTOMER)
                .oauthProvider(User.OAuthProvider.LOCAL)
                .build();
    }
}
