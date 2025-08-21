'use client';

import { useDeleteUser } from '@/hooks/useAuth';

export default function DeleteUserTestPage() {
  const { deleteUser, isLoading, isError, error } = useDeleteUser();

  const handleDeleteUser = async () => {
    if (confirm('정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deleteUser();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">회원탈퇴 테스트</h1>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h2 className="text-lg font-semibold text-red-800 mb-3">⚠️ 주의사항</h2>
        <p className="text-red-700 text-sm">
          이 버튼을 클릭하면 계정이 영구적으로 삭제됩니다.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDeleteUser}
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리중...' : '회원탈퇴'}
        </button>
      </div>

      {isError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-800 font-semibold">오류 발생</h3>
          <p className="text-red-700 text-sm">{error?.message}</p>
        </div>
      )}
    </div>
  );
}
