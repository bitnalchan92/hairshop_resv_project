export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  oauthProvider?: 'KAKAO' | 'NAVER' | 'LOCAL';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}
