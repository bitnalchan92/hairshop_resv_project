import apiClient from './api';
import { API_ENDPOINTS } from './constants';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'CUSTOMER' | 'OWNER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    phone: string;
    role: 'CUSTOMER' | 'OWNER' | 'ADMIN';
    oauthProvider?: 'KAKAO' | 'NAVER' | 'LOCAL';
    createdAt: string;
  };
}

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

/**
 * 회원가입
 */
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * 내 정보 조회
 */
export const getMe = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
    refreshToken,
  });
  return response.data;
};
