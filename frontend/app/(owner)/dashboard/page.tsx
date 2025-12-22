'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">미용실 관리 대시보드</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 사용자 정보 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">사장님 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">이름</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">전화번호</p>
              <p className="font-medium">{user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">가입일</p>
              <p className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* 대시보드 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">예약 관리</h3>
            <p className="text-gray-600 text-sm">신규 예약 확인 및 관리</p>
            <p className="text-3xl font-bold text-blue-600 mt-4">0</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">일정 관리</h3>
            <p className="text-gray-600 text-sm">영업일 및 휴무일 설정</p>
            <p className="text-sm text-gray-500 mt-4">설정하기 →</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">서비스 관리</h3>
            <p className="text-gray-600 text-sm">컷/펌 서비스 및 가격 설정</p>
            <p className="text-sm text-gray-500 mt-4">관리하기 →</p>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            미용실 예약 플랫폼에 오신 것을 환영합니다!
          </h3>
          <p className="text-blue-800">
            이곳에서 예약 관리, 일정 설정, 서비스 관리 등을 할 수 있습니다.
            <br />
            현재는 데모 버전입니다. 추가 기능이 곧 출시될 예정입니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="OWNER">
      <DashboardContent />
    </ProtectedRoute>
  );
}
