# 🎨 Frontend - 미용실 예약 플랫폼

Next.js 기반 프론트엔드 애플리케이션

## 🛠 기술 스택

- **Framework**: Next.js 14.2.18
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 4.5.0
- **API Client**: Axios 1.6.5 + SWR 2.2.4
- **Form**: React Hook Form 7.49.3 + Zod 3.22.4

## 📦 설치

```bash
npm install
```

## 🚀 실행

### 개발 모드
```bash
npm run dev
```
http://localhost:3000 에서 확인

### 프로덕션 빌드
```bash
npm run build
npm run start
```

## 🔒 보안

### 보안 감사
```bash
# 취약점 검사
npm run security:audit

# 취약점 자동 수정
npm run security:fix

# 패키지 업데이트 확인
npm run security:check
```

### 주간 보안 체크
```bash
npm run security:weekly
```

## 📁 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router
│   ├── (customer)/        # 손님용 페이지
│   ├── (owner)/           # 사장님용 페이지
│   ├── auth/              # 인증 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 컴포넌트
├── lib/                   # 유틸리티, API 클라이언트
├── hooks/                 # Custom Hooks
├── stores/                # Zustand 스토어
├── types/                 # TypeScript 타입
└── public/                # 정적 파일
```

## 🌍 환경 변수

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

필수 환경 변수:
- `NEXT_PUBLIC_API_URL`: 백엔드 API URL
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`: 토스페이먼츠 클라이언트 키
- Firebase 설정 (푸시 알림용)
- OAuth 설정 (카카오, 네이버)

## 📝 주요 기능

- 🔐 소셜 로그인 (카카오, 네이버)
- 🏪 미용실 검색 및 상세 조회
- 📅 예약 가능 시간대 확인
- 💳 토스페이먼츠 결제 연동
- 🔔 실시간 푸시 알림 (Firebase)
- ⭐ 리뷰 작성 및 조회

## 🔧 개발 가이드

### 새 페이지 추가
```bash
# 손님용 페이지
app/(customer)/새페이지/page.tsx

# 사장님용 페이지
app/(owner)/새페이지/page.tsx
```

### API 호출
```typescript
import apiClient from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const response = await apiClient.get(API_ENDPOINTS.SHOPS.LIST);
```

### 상태 관리
```typescript
// stores/authStore.ts
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 🧪 테스트

(예정)

## 📄 라이선스

MIT License
