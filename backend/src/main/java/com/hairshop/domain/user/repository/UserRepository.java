package com.hairshop.domain.user.repository;

import com.hairshop.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 찾기
     */
    Optional<User> findByEmail(String email);

    /**
     * 이메일 중복 체크
     */
    boolean existsByEmail(String email);

    /**
     * 전화번호로 사용자 찾기
     */
    Optional<User> findByPhone(String phone);

    /**
     * OAuth ID로 사용자 찾기
     */
    Optional<User> findByOauthProviderAndOauthId(User.OAuthProvider provider, String oauthId);

    /**
     * 삭제되지 않은 사용자를 이메일로 찾기
     */
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
}
