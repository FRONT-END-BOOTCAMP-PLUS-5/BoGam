import { useMutation } from '@tanstack/react-query';
import { authApi } from '@libs/api_front/auth.api';
import { signOut } from 'next-auth/react';

export const useDeleteUser = () => {
  const deleteUserMutation = useMutation({
    mutationFn: () => authApi.deleteUser(),
    onSuccess: async (data) => {
      if (data.success) {
        console.log('회원탈퇴 성공:', data.message);
        
        try {
          // 1. NextAuth 로그아웃 (세션/JWT 토큰 정리)
          console.log('회원탈퇴 - NextAuth signOut 시작');
          await signOut({
            redirect: false,
            callbackUrl: '/',
          });
          console.log('회원탈퇴 - NextAuth signOut 완료');

          // 2. sessionStorage 완전 정리
          console.log('회원탈퇴 - sessionStorage 정리');
          sessionStorage.clear(); // 모든 sessionStorage 데이터 삭제
          
          // 3. localStorage 정리 (필요한 경우)
          console.log('회원탈퇴 - localStorage 정리');
          localStorage.removeItem('user-store');
          localStorage.removeItem('user-address-store');
          
          // 4. 쿠키 정리 (필요한 경우)
          console.log('회원탈퇴 - 쿠키 정리');
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });

          // 5. 홈페이지로 강제 리디렉트 (브라우저 새로고침)
          console.log('회원탈퇴 - 홈페이지로 리디렉트');
          window.location.href = '/';
        } catch (error) {
          console.error('회원탈퇴 후 정리 중 오류:', error);
          // 오류가 발생해도 홈페이지로 이동
          window.location.href = '/';
        }
      } else {
        console.error('회원탈퇴 실패:', data.message);
      }
    },
    onError: (error) => {
      console.error('회원탈퇴 API 오류:', error);
    },
  });

  return {
    deleteUser: deleteUserMutation.mutate,
    isLoading: deleteUserMutation.isPending,
    isError: deleteUserMutation.isError,
    error: deleteUserMutation.error,
  };
};
