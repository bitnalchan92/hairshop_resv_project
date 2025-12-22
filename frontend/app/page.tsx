'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          🪮 미용실 예약 플랫폼
        </h1>
        <p className="text-center text-lg mb-4">
          간편한 예약, 안전한 결제
        </p>

        {user ? (
          <div className="mt-8 text-center">
            <div className="bg-white shadow rounded-lg p-6 mb-4">
              <p className="text-xl font-semibold mb-2">환영합니다, {user.name}님!</p>
              <p className="text-gray-600 mb-1">이메일: {user.email}</p>
              <p className="text-gray-600 mb-1">전화번호: {user.phone}</p>
              <p className="text-gray-600">
                역할: {user.role === 'CUSTOMER' ? '손님' : '미용실 사장님'}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              {user.role === 'OWNER' ? (
                <button
                  onClick={() => router.push('/owner/dashboard')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  대시보드로 이동
                </button>
              ) : (
                <button
                  onClick={() => router.push('/customer')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  예약하기
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              로그인
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
