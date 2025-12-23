# 멀티테넌트 예약 플랫폼 - Backend API

NestJS + Prisma + PostgreSQL 기반의 멀티테넌트 예약 시스템 백엔드

## 🛠 기술 스택

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.22.0
- **Database**: PostgreSQL
- **Validation**: class-validator, class-transformer

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 설정합니다.

```bash
cp .env.example .env
```

`.env` 파일 예시:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/booking_platform?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### 3. 데이터베이스 마이그레이션

```bash
# Prisma 마이그레이션 생성 및 실행
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 4. 개발 서버 실행

```bash
npm run start:dev
```

서버가 실행되면: `http://localhost:3001/api`

## 📁 프로젝트 구조

```
backend/
├── prisma/
│   └── schema.prisma          # Prisma 스키마 (ERD)
├── src/
│   ├── prisma/
│   │   ├── prisma.service.ts  # Prisma Service
│   │   └── prisma.module.ts   # Prisma Module (Global)
│   ├── app.module.ts          # Root Module
│   └── main.ts                # Entry Point
├── .env                       # 환경 변수 (gitignore)
├── .env.example               # 환경 변수 예시
└── package.json
```

## 🗄 데이터베이스 ERD

### 주요 엔티티

1. **Admin** - 플랫폼 관리자
2. **Tenant** - 사장님/스토어 (멀티테넌시 핵심)
3. **TenantBranding** - 사장님 브랜딩 설정
4. **StoreInfo** - 스토어 정보
5. **Service** - 서비스/상품
6. **Holiday** - 휴무일
7. **Booking** - 예약
8. **Payment** - 결제
9. **Customer** - 고객
10. **Notification** - 알림

### 멀티테넌시 구조

- 모든 주요 테이블에 `tenantId` 필드 존재
- `PrismaService.forTenant(tenantId)` 헬퍼로 데이터 격리 보장
- Row-Level Security를 통한 안전한 데이터 접근

## 🔧 주요 스크립트

```bash
# 개발 서버 (Hot Reload)
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 테스트
npm run test

# E2E 테스트
npm run test:e2e

# Prisma Studio (DB GUI)
npx prisma studio
```

## 📊 Prisma 명령어

```bash
# Prisma Client 생성
npx prisma generate

# 마이그레이션 생성 및 실행
npx prisma migrate dev --name <migration-name>

# 마이그레이션 배포 (프로덕션)
npx prisma migrate deploy

# 데이터베이스 리셋 (개발 환경만)
npx prisma migrate reset

# Prisma Studio 실행
npx prisma studio
```

## 🌐 API 엔드포인트 (예정)

모든 API는 `/api` prefix를 사용합니다.

### Admin (플랫폼 관리자)
- `POST /api/admin/auth/login` - 관리자 로그인
- `GET /api/admin/tenants` - 사장님 목록 조회
- `POST /api/admin/tenants` - 사장님 등록
- `PATCH /api/admin/tenants/:id` - 사장님 정보 수정

### Tenant (사장님)
- `POST /api/tenant/auth/login` - 사장님 로그인
- `GET /api/tenant/bookings` - 예약 목록 조회
- `PATCH /api/tenant/bookings/:id` - 예약 수락/거절
- `GET /api/tenant/services` - 서비스 목록 조회
- `POST /api/tenant/services` - 서비스 등록

### Public (고객)
- `GET /api/:tenantSlug/services` - 특정 스토어 서비스 조회
- `GET /api/:tenantSlug/availability` - 예약 가능 시간 조회
- `POST /api/:tenantSlug/bookings` - 예약 생성
- `POST /api/:tenantSlug/payments` - 결제 처리

## 🔐 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 URL | `postgresql://user:pass@localhost:5432/db` |
| `PORT` | 서버 포트 | `3001` |
| `NODE_ENV` | 실행 환경 | `development`, `production` |
| `JWT_SECRET` | JWT 시크릿 키 | `your-secret-key` |
| `FRONTEND_URL` | 프론트엔드 URL (CORS) | `http://localhost:3000` |

## 🚀 다음 단계

1. **인증 모듈 구현** (JWT + Passport)
2. **Tenant 모듈 구현** (사장님 관리)
3. **Booking 모듈 구현** (예약 시스템)
4. **Payment 모듈 구현** (결제 연동)
5. **Notification 모듈 구현** (알림 시스템)

## 📝 개발 가이드

### 멀티테넌시 데이터 접근

```typescript
// ❌ 잘못된 방법 (tenant 격리 없음)
const bookings = await this.prisma.booking.findMany();

// ✅ 올바른 방법 (tenant 격리)
const bookings = await this.prisma.forTenant(tenantId).booking.findMany();
```

### DTO 검증

```typescript
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEmail()
  ownerEmail: string;
}
```

## 🐳 Docker (추후)

```bash
# Docker Compose로 PostgreSQL 실행
docker-compose up -d

# 컨테이너 중지
docker-compose down
```

## 📄 라이선스

MIT

---

**작성일**: 2025-12-23
**버전**: 0.1.0
