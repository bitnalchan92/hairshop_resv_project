# ⚙️ Backend - 미용실 예약 플랫폼

Spring Boot 기반 백엔드 API 서버

## 🛠 기술 스택

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle

## 📦 필수 요구사항

- Java 17 이상
- PostgreSQL 14 이상
- Gradle 8.0 이상

## 🚀 시작하기

### 1. PostgreSQL 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE hairshop;
```

### 2. 환경 변수 설정

`src/main/resources/application.yml` 파일에서 다음 값들을 설정:

- Database 연결 정보
- JWT Secret Key
- OAuth Client ID/Secret (카카오, 네이버)
- 토스페이먼츠 API 키
- Firebase Credentials
- 카카오 알림톡 API 키

### 3. 실행

```bash
# Gradle로 실행
./gradlew bootRun

# 또는 빌드 후 실행
./gradlew build
java -jar build/libs/hairshop-backend-1.0.0.jar
```

서버가 http://localhost:8080 에서 실행됩니다.

### 4. Health Check

```bash
curl http://localhost:8080/api/v1/health
```

## 📁 프로젝트 구조

```
backend/
└── src/main/java/com/hairshop/
    ├── HairshopApplication.java      # 메인 클래스
    │
    ├── domain/                        # 도메인 모델
    │   ├── user/                      # 사용자 도메인
    │   │   ├── entity/
    │   │   ├── repository/
    │   │   └── service/
    │   ├── shop/                      # 미용실 도메인
    │   ├── service/                   # 서비스(컷/펌) 도메인
    │   ├── reservation/               # 예약 도메인
    │   ├── payment/                   # 결제 도메인
    │   ├── schedule/                  # 일정 도메인
    │   └── review/                    # 리뷰 도메인
    │
    ├── controller/                    # REST API 컨트롤러
    ├── dto/                           # DTO (요청/응답)
    ├── config/                        # 설정 클래스
    ├── security/                      # 보안 (JWT 등)
    ├── exception/                     # 예외 처리
    └── util/                          # 유틸리티
```

## 🔐 보안

- JWT 기반 인증/인가
- Spring Security 적용
- CORS 설정 (Next.js 프론트엔드와 통신)
- BCrypt 패스워드 암호화

## 📋 주요 API 엔드포인트

### 인증
- `POST /auth/login` - 로그인
- `POST /auth/signup` - 회원가입
- `POST /auth/oauth/kakao` - 카카오 로그인
- `POST /auth/oauth/naver` - 네이버 로그인

### 미용실
- `GET /shops` - 미용실 목록
- `GET /shops/{id}` - 미용실 상세
- `POST /shops` - 미용실 등록 (사장님)

### 예약
- `GET /reservations` - 내 예약 목록
- `POST /reservations` - 예약 생성
- `PUT /reservations/{id}/confirm` - 예약 확정 (사장님)

### 결제
- `POST /payments/request` - 결제 요청
- `POST /payments/confirm` - 결제 승인

### 리뷰
- `POST /reviews` - 리뷰 작성
- `GET /shops/{shopId}/reviews` - 미용실 리뷰 목록

## 🔧 개발 가이드

### 새 도메인 추가

1. `domain/{도메인명}/entity/` - 엔티티 작성
2. `domain/{도메인명}/repository/` - Repository 작성
3. `domain/{도메인명}/service/` - Service 작성
4. `controller/` - Controller 작성
5. `dto/` - Request/Response DTO 작성

### 데이터베이스 스키마 변경

`application.yml`의 `spring.jpa.hibernate.ddl-auto` 설정:
- `update`: 자동 스키마 업데이트 (개발용)
- `validate`: 검증만 (프로덕션)
- `create-drop`: 재시작 시 삭제 후 재생성 (테스트용)

## 🧪 테스트

```bash
./gradlew test
```

## 📦 배포

### JAR 빌드
```bash
./gradlew clean build
```

빌드된 파일: `build/libs/hairshop-backend-1.0.0.jar`

### Docker (예정)
```bash
docker build -t hairshop-backend .
docker run -p 8080:8080 hairshop-backend
```

## 📄 라이선스

MIT License
