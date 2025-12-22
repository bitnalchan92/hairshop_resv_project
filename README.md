# 🪮 미용실 예약 플랫폼

1인 소규모 미용실을 위한 간편 예약 및 결제 솔루션

## 📋 프로젝트 개요

- **목적**: 영세 미용실 사장님과 손님을 위한 쉬운 예약 시스템
- **목표**: 도봉구 방학동 내 6개월 내 활성 스토어 100개 확보
- **특징**: 모바일 우선 UI, 간편 결제, 실시간 알림

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14.2.18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **API**: Axios + SWR
- **Notifications**: Firebase Cloud Messaging

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Security**: Spring Security + JWT
- **Notifications**: Firebase Admin SDK, 카카오 알림톡

### External APIs
- **결제**: 토스페이먼츠
- **소셜 로그인**: 카카오, 네이버 OAuth 2.0
- **알림**: Firebase, 카카오 알림톡

## 📁 프로젝트 구조

```
hairshop_resv_project/
├── frontend/          # Next.js 프론트엔드
├── backend/           # Spring Boot 백엔드
└── docs/             # 문서 (ERD, API 명세 등)
```

## 🚀 시작하기

### 필수 요구사항
- Node.js >= 18.17.0
- Java 17
- PostgreSQL 14+
- npm >= 9.0.0

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```
http://localhost:3000 에서 확인

### Backend 실행
```bash
cd backend
./gradlew bootRun
```
http://localhost:8080 에서 확인

## 🔐 보안

- Next.js 14.2.18 사용 (CVE-2025-66478 패치됨)
- React 18.3.1 사용 (CVE-2025-55182 회피)
- 주간 보안 감사 실행: `npm run security:audit`

## 📝 문서

- [PRD](./미용실%20예약%20사이트%20구축%20프로젝트%20PRD.md)
- API 문서: `/docs/api/`
- ERD: `/docs/ERD.png`

## 👥 기여

이 프로젝트는 개인 프로젝트입니다.

## 📄 라이선스

MIT License
