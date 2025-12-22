/**
 * API 엔드포인트
 */
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    OAUTH_KAKAO: '/auth/oauth/kakao',
    OAUTH_NAVER: '/auth/oauth/naver',
  },
  // 미용실
  SHOPS: {
    LIST: '/shops',
    DETAIL: (id: number) => `/shops/${id}`,
    CREATE: '/shops',
    UPDATE: (id: number) => `/shops/${id}`,
    DELETE: (id: number) => `/shops/${id}`,
    SERVICES: (id: number) => `/shops/${id}/services`,
    SCHEDULES: (id: number) => `/shops/${id}/schedules`,
    AVAILABLE_SLOTS: (id: number) => `/shops/${id}/available-slots`,
    RESERVATIONS: (id: number) => `/shops/${id}/reservations`,
    REVIEWS: (id: number) => `/shops/${id}/reviews`,
  },
  // 예약
  RESERVATIONS: {
    LIST: '/reservations',
    DETAIL: (id: number) => `/reservations/${id}`,
    CREATE: '/reservations',
    CONFIRM: (id: number) => `/reservations/${id}/confirm`,
    CANCEL: (id: number) => `/reservations/${id}/cancel`,
    COMPLETE: (id: number) => `/reservations/${id}/complete`,
  },
  // 결제
  PAYMENTS: {
    REQUEST: '/payments/request',
    CONFIRM: '/payments/confirm',
    CANCEL: (id: number) => `/payments/${id}/cancel`,
    REFUND: (id: number) => `/payments/${id}/refund`,
    DETAIL: (id: number) => `/payments/${id}`,
  },
  // 리뷰
  REVIEWS: {
    CREATE: '/reviews',
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
    REPLY: (id: number) => `/reviews/${id}/reply`,
  },
  // 알림
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: number) => `/notifications/${id}/read`,
    DELETE: (id: number) => `/notifications/${id}`,
  },
  // 디바이스
  DEVICES: {
    REGISTER: '/devices',
    DELETE: (id: number) => `/devices/${id}`,
  },
} as const;

/**
 * 예약 상태
 */
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

/**
 * 결제 상태
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  PARTIAL_REFUND: 'PARTIAL_REFUND',
} as const;

/**
 * 사용자 역할
 */
export const USER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

/**
 * 서비스 카테고리
 */
export const SERVICE_CATEGORY = {
  CUT: 'CUT',
  PERM: 'PERM',
  DYE: 'DYE',
  TREATMENT: 'TREATMENT',
} as const;

/**
 * 서비스 카테고리 한글명
 */
export const SERVICE_CATEGORY_LABEL: Record<string, string> = {
  CUT: '커트',
  PERM: '펌',
  DYE: '염색',
  TREATMENT: '트리트먼트',
};

/**
 * 예약 상태 한글명
 */
export const RESERVATION_STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중',
  CONFIRMED: '확정',
  CANCELLED: '취소됨',
  COMPLETED: '완료',
  NO_SHOW: '노쇼',
};

/**
 * 결제 상태 한글명
 */
export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  CANCELLED: '결제 취소',
  REFUNDED: '환불 완료',
  PARTIAL_REFUND: '부분 환불',
};
