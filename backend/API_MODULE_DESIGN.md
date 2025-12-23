# API 모듈 구조 설계

## 🏗 전체 아키텍처

```
src/
├── main.ts                      # 애플리케이션 진입점
├── app.module.ts                # 루트 모듈
│
├── prisma/                      # Prisma 서비스 (Global)
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── common/                      # 공통 유틸리티
│   ├── decorators/              # 커스텀 데코레이터
│   │   ├── tenant.decorator.ts  # @CurrentTenant()
│   │   └── public.decorator.ts  # @Public()
│   ├── guards/                  # 가드
│   │   ├── jwt-auth.guard.ts
│   │   └── tenant-access.guard.ts
│   ├── filters/                 # 예외 필터
│   │   └── http-exception.filter.ts
│   ├── interceptors/            # 인터셉터
│   │   └── transform.interceptor.ts
│   └── types/                   # 공통 타입
│       └── request.interface.ts
│
├── auth/                        # 인증 모듈
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── admin/                       # 플랫폼 관리자 모듈
│   ├── admin.module.ts
│   ├── tenants/                 # 사장님 관리
│   │   ├── tenants.controller.ts
│   │   ├── tenants.service.ts
│   │   └── dto/
│   │       ├── create-tenant.dto.ts
│   │       ├── update-tenant.dto.ts
│   │       └── branding.dto.ts
│   └── dashboard/               # 대시보드
│       ├── dashboard.controller.ts
│       └── dashboard.service.ts
│
├── tenant/                      # 사장님(테넌트) 모듈
│   ├── tenant.module.ts
│   ├── services/                # 서비스(상품) 관리
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── dto/
│   │       ├── create-service.dto.ts
│   │       └── update-service.dto.ts
│   ├── bookings/                # 예약 관리
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   └── dto/
│   │       ├── update-booking-status.dto.ts
│   │       └── booking-filter.dto.ts
│   ├── holidays/                # 휴무일 관리
│   │   ├── holidays.controller.ts
│   │   ├── holidays.service.ts
│   │   └── dto/
│   │       └── create-holiday.dto.ts
│   ├── customers/               # 고객 관리
│   │   ├── customers.controller.ts
│   │   └── customers.service.ts
│   └── store/                   # 스토어 설정
│       ├── store.controller.ts
│       ├── store.service.ts
│       └── dto/
│           └── update-store-info.dto.ts
│
└── public/                      # 공개 API (고객용)
    ├── public.module.ts
    ├── [tenantSlug]/            # 동적 라우팅 처리
    │   ├── services/            # 서비스 조회
    │   │   ├── public-services.controller.ts
    │   │   └── public-services.service.ts
    │   ├── bookings/            # 예약 생성
    │   │   ├── public-bookings.controller.ts
    │   │   ├── public-bookings.service.ts
    │   │   └── dto/
    │   │       └── create-booking.dto.ts
    │   ├── availability/        # 예약 가능 시간 조회
    │   │   ├── availability.controller.ts
    │   │   └── availability.service.ts
    │   └── payments/            # 결제 처리
    │       ├── payments.controller.ts
    │       ├── payments.service.ts
    │       └── dto/
    │           └── create-payment.dto.ts
    └── middleware/
        └── tenant-resolver.middleware.ts  # tenantSlug → tenantId 변환
```

---

## 📍 API 엔드포인트 설계

### 1. Admin API (`/api/admin/*`)

**인증**: JWT (Admin만 접근 가능)

#### 1.1 사장님 관리
```
GET    /api/admin/tenants              # 사장님 목록 조회
POST   /api/admin/tenants              # 사장님 등록
GET    /api/admin/tenants/:id          # 사장님 상세 조회
PATCH  /api/admin/tenants/:id          # 사장님 정보 수정
DELETE /api/admin/tenants/:id          # 사장님 삭제
PATCH  /api/admin/tenants/:id/branding # 브랜딩 설정
PATCH  /api/admin/tenants/:id/status   # 구독 상태 변경
```

#### 1.2 대시보드
```
GET    /api/admin/dashboard/stats      # 전체 통계
GET    /api/admin/dashboard/tenants    # 사장님별 통계
GET    /api/admin/dashboard/revenue    # 매출 통계
```

---

### 2. Tenant API (`/api/tenant/*`)

**인증**: JWT (Tenant만 접근 가능)
**데이터 격리**: 자동으로 tenantId 필터링

#### 2.1 서비스(상품) 관리
```
GET    /api/tenant/services            # 내 서비스 목록
POST   /api/tenant/services            # 서비스 등록
GET    /api/tenant/services/:id        # 서비스 상세
PATCH  /api/tenant/services/:id        # 서비스 수정
DELETE /api/tenant/services/:id        # 서비스 삭제
PATCH  /api/tenant/services/:id/toggle # 활성/비활성 토글
```

#### 2.2 예약 관리
```
GET    /api/tenant/bookings            # 예약 목록 (필터: 날짜, 상태)
GET    /api/tenant/bookings/:id        # 예약 상세
PATCH  /api/tenant/bookings/:id/confirm # 예약 수락
PATCH  /api/tenant/bookings/:id/reject  # 예약 거절
PATCH  /api/tenant/bookings/:id/cancel  # 예약 취소
```

#### 2.3 휴무일 관리
```
GET    /api/tenant/holidays            # 휴무일 목록
POST   /api/tenant/holidays            # 휴무일 등록
DELETE /api/tenant/holidays/:id        # 휴무일 삭제
```

#### 2.4 고객 관리
```
GET    /api/tenant/customers           # 고객 목록
GET    /api/tenant/customers/:id       # 고객 상세 (예약 히스토리)
PATCH  /api/tenant/customers/:id       # 고객 메모 수정
```

#### 2.5 스토어 설정
```
GET    /api/tenant/store               # 내 스토어 정보
PATCH  /api/tenant/store               # 스토어 정보 수정
PATCH  /api/tenant/store/hours         # 영업 시간 수정
```

---

### 3. Public API (`/api/:tenantSlug/*`)

**인증**: 없음 (공개 API)
**특징**: tenantSlug로 테넌트 식별

#### 3.1 스토어 정보
```
GET    /api/:tenantSlug/info           # 스토어 기본 정보 + 브랜딩
```

#### 3.2 서비스 조회
```
GET    /api/:tenantSlug/services       # 활성화된 서비스 목록
GET    /api/:tenantSlug/services/:id   # 서비스 상세
```

#### 3.3 예약 가능 시간 조회
```
GET    /api/:tenantSlug/availability?serviceId=xxx&date=2025-12-25
# 응답: { availableSlots: ["09:00", "10:00", "11:00", ...] }
```

#### 3.4 예약 생성
```
POST   /api/:tenantSlug/bookings       # 예약 생성
GET    /api/:tenantSlug/bookings/:id   # 예약 조회 (예약 번호 필요)
DELETE /api/:tenantSlug/bookings/:id   # 예약 취소 (고객)
```

#### 3.5 결제
```
POST   /api/:tenantSlug/payments       # 결제 생성 (PG사 연동)
POST   /api/:tenantSlug/payments/webhook # 결제 결과 웹훅
```

---

### 4. Auth API (`/api/auth/*`)

**인증**: 없음 (로그인 전)

```
POST   /api/auth/admin/login           # 관리자 로그인
POST   /api/auth/tenant/login          # 사장님 로그인
POST   /api/auth/tenant/register       # 사장님 회원가입 (추후)
POST   /api/auth/refresh               # 토큰 갱신
```

---

## 🔐 인증 및 권한 관리

### JWT 토큰 구조

```typescript
// Admin Token Payload
{
  sub: adminId,
  email: "admin@example.com",
  role: "admin"
}

// Tenant Token Payload
{
  sub: tenantId,
  email: "owner@example.com",
  role: "tenant",
  tenantId: "tenant_xxx",
  slug: "jimin-salon"
}
```

### 가드 적용 예시

```typescript
// Admin만 접근 가능
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('api/admin')
export class AdminController {}

// Tenant만 접근 가능 + 자동 tenantId 주입
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('api/tenant')
export class TenantController {}

// 공개 API
@Public()  // 인증 불필요
@Controller('api/:tenantSlug')
export class PublicController {}
```

---

## 🗂 DTO 설계 원칙

### 1. 일관된 네이밍
- `CreateXxxDto`: 생성 DTO
- `UpdateXxxDto`: 수정 DTO
- `XxxResponseDto`: 응답 DTO
- `XxxFilterDto`: 필터/검색 DTO

### 2. 검증 데코레이터 사용
```typescript
import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(15)
  durationMinutes: number;

  @IsString()
  @IsOptional()
  description?: string;
}
```

### 3. 응답 타입 변환
```typescript
// Prisma 타입을 그대로 노출하지 않고, DTO로 변환
export class ServiceResponseDto {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  imageUrl?: string;

  // 민감한 정보 제외
  // tenantId는 응답에 포함하지 않음
}
```

---

## 🔄 서비스 레이어 패턴

### 멀티테넌시 데이터 접근

```typescript
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // ✅ 올바른 방법: tenantId로 격리
  async findAll(tenantId: string) {
    return this.prisma.service.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  // ✅ 생성 시 자동으로 tenantId 주입
  async create(tenantId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        tenantId, // 자동 주입
      },
    });
  }

  // ❌ 잘못된 방법: tenantId 없이 조회
  async findAllWrong() {
    return this.prisma.service.findMany(); // 다른 사장님 데이터 노출 위험!
  }
}
```

---

## 📦 모듈 의존성

```
AppModule
├─ PrismaModule (Global)
├─ AuthModule
│  └─ JwtModule
├─ AdminModule
│  ├─ TenantsModule
│  └─ DashboardModule
├─ TenantModule
│  ├─ ServicesModule
│  ├─ BookingsModule
│  ├─ HolidaysModule
│  ├─ CustomersModule
│  └─ StoreModule
└─ PublicModule
   ├─ PublicServicesModule
   ├─ PublicBookingsModule
   ├─ AvailabilityModule
   └─ PaymentsModule
```

---

## 🧪 테스트 전략

### 1. Unit Tests
- 각 Service의 비즈니스 로직 테스트
- Prisma는 Mock 처리

### 2. Integration Tests
- Controller + Service + DB 통합 테스트
- 실제 DB 사용 (테스트 전용)

### 3. E2E Tests
- 전체 API 플로우 테스트
- 예약 생성 → 결제 → 확정 전체 흐름

---

## 🚀 다음 구현 우선순위

### Phase 1: 핵심 Public API (고객용)
1. ✅ DB 세팅 완료
2. 🔲 TenantResolver Middleware (slug → tenantId)
3. 🔲 Public Services API (서비스 조회)
4. 🔲 Availability API (예약 가능 시간)
5. 🔲 Public Bookings API (예약 생성)
6. 🔲 Payments API (결제 연동)

### Phase 2: Tenant Admin (사장님용)
1. 🔲 Auth Module (JWT)
2. 🔲 Tenant Services API (서비스 관리)
3. 🔲 Tenant Bookings API (예약 관리)
4. 🔲 Tenant Store API (스토어 설정)

### Phase 3: Platform Admin (플랫폼 관리자용)
1. 🔲 Admin Tenants API (사장님 관리)
2. 🔲 Admin Dashboard API (통계)

---

**작성일**: 2025-12-23
**버전**: 1.0
