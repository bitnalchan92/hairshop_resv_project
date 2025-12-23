# 🎯 멀티테넌트 예약 플랫폼

예약이 필요한 개인사업자를 위한 맞춤형 예약 홈페이지 SaaS 플랫폼

## 📋 프로젝트 개요

- **비즈니스 모델**: 멀티테넌트 SaaS 플랫폼
- **목적**: 미용실, 필라테스, 네일샵 등 다양한 개인사업자에게 커스터마이징된 예약 홈페이지 제공
- **목표**: 6개월 내 활성 스토어 20개 → 12개월 100개 확보 (월 구독 매출 500만원)
- **핵심 가치**: 사장님별 브랜딩 + 호스팅 + 도메인 연결 + 유지보수 올인원 서비스
- **특징**: 모바일 우선 UI, 간편 결제, 실시간 알림, 화이트라벨링

## 👥 사용자 역할

1. **플랫폼 관리자**: 사장님 등록, 랜딩페이지 커스터마이징, 구독 관리
2. **사장님 (Tenant)**: 스토어 관리, 서비스 등록, 예약 수락/거절
3. **고객**: 서비스 예약 및 결제

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14.2.18 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TBD (Zustand or React Query)

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma 5.22.0
- **Authentication**: JWT (추후)
- **Validation**: class-validator, class-transformer

### Infrastructure
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)
- **Database**: PostgreSQL (Supabase or Railway)
- **Storage**: TBD (S3 or Cloudflare R2)

### External APIs
- **결제**: 포트원(PortOne) or 토스페이먼츠
- **알림**: TBD (SMS, Email)

## 📁 프로젝트 구조

```
hairshop_resv_project/
├── frontend/                    # Next.js 프론트엔드
│   ├── app/                     # Next.js 14 App Router
│   ├── components/              # React 컴포넌트
│   └── public/                  # 정적 파일
├── backend/                     # NestJS 백엔드
│   ├── prisma/                  # Prisma 스키마 및 마이그레이션
│   │   └── schema.prisma        # ERD 정의
│   └── src/
│       ├── prisma/              # Prisma 서비스
│       └── main.ts              # 엔트리 포인트
├── backend-old/                 # (백업) 기존 Spring Boot
├── 멀티테넌트 예약 플랫폼 PRD v2.md  # 제품 요구사항 정의서
└── README.md
```

## 🚀 빠른 시작

### 필수 요구사항
- Node.js >= 18.17.0
- PostgreSQL 14+
- npm >= 9.0.0

### Backend 실행

```bash
cd backend

# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일에서 DATABASE_URL 등 설정

# 3. Prisma 마이그레이션 (DB 생성)
npx prisma migrate dev --name init

# 4. Prisma Client 생성
npx prisma generate

# 5. 개발 서버 실행
npm run start:dev
```

**Backend 접속**: http://localhost:3001/api

### Frontend 실행

```bash
cd frontend

# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

**Frontend 접속**: http://localhost:3000

## 🗄 데이터베이스 ERD

상세 ERD는 `backend/prisma/schema.prisma` 파일 참고

**핵심 엔티티**:
- `Admin` - 플랫폼 관리자
- `Tenant` - 사장님/스토어 (멀티테넌시 핵심)
- `TenantBranding` - 사장님 브랜딩 설정
- `Service` - 서비스/상품
- `Booking` - 예약
- `Payment` - 결제
- `Customer` - 고객
- `Notification` - 알림

**멀티테넌시 구조**: 모든 주요 테이블에 `tenantId` 필드로 데이터 격리

## 📝 문서

- **[PRD v2.0](./멀티테넌트%20예약%20플랫폼%20PRD%20v2.md)** - 최신 제품 요구사항 정의서
- **[Backend README](./backend/README.md)** - 백엔드 상세 문서
- **[ERD 스키마](./backend/prisma/schema.prisma)** - Prisma 데이터베이스 스키마

## 🛣 개발 로드맵

### Phase 1: MVP (현재)
- [x] NestJS 백엔드 초기 세팅
- [x] Prisma ERD 설계 완료
- [ ] 고객 예약 페이지 (서비스 선택 → 날짜/시간 → 결제)
- [ ] 결제 연동 (포트원/토스)
- [ ] 사장님 어드민 (예약 관리)

### Phase 2: 멀티테넌시
- [ ] Tenant 모델 및 브랜딩 시스템
- [ ] 서브도메인 라우팅
- [ ] 플랫폼 관리자 어드민
- [ ] 데이터 격리 검증

### Phase 3: 운영 안정화
- [ ] 알림 시스템 (SMS, Email)
- [ ] 환불 및 취소 정책
- [ ] 모니터링 (Sentry)
- [ ] 성능 최적화

## 👥 기여

이 프로젝트는 개인 프로젝트입니다.

## 📄 라이선스

MIT License
