package com.hairshop.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private OAuthProvider oauthProvider;

    @Column(length = 255)
    private String oauthId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime deletedAt;

    // 사용자 역할
    public enum UserRole {
        CUSTOMER,  // 손님
        OWNER,     // 사장님
        ADMIN      // 관리자
    }

    // OAuth 제공자
    public enum OAuthProvider {
        LOCAL,     // 일반 로그인
        KAKAO,     // 카카오
        NAVER      // 네이버
    }

    // 소프트 삭제 여부 확인
    public boolean isDeleted() {
        return deletedAt != null;
    }

    // 소프트 삭제 처리
    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }
}
