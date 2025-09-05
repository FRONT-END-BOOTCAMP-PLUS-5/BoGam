'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRootStep } from '@libs/stores/rootStepStore';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { authApi } from '@libs/api_front/auth.api';
import { styles } from './WithdrawButton.styles';

export default function WithdrawButton() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const clearUser = useUserStore((state) => state.clearUser);
  const { clearAll } = useUserAddressStore();
  const { setStep } = useRootStep();

  // 회원탈퇴 처리
  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      
      const response = await authApi.deleteUser();
      
      if (response.success) {
        // 성공적으로 삭제된 경우 상태 정리 및 홈페이지 이동
        await handleUserCleanup();
      } else {
        setErrorMessage(response.message || '회원탈퇴 처리 중 오류가 발생했습니다.');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage('회원탈퇴 처리 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // 사용자 상태 정리 및 로그아웃 처리
  const handleUserCleanup = async () => {
    try {
      // 1. 클라이언트 상태 초기화
      clearUser();
      clearAll();

      // 2. sessionStorage 정리 (step 제외)
      sessionStorage.removeItem('user-store');
      sessionStorage.removeItem('user-address-store');

      // 3. step을 auth로 설정하고 sessionStorage에 저장
      setStep('auth');
      sessionStorage.setItem('step', 'auth');

      // 4. NextAuth 로그아웃
      await signOut({
        redirect: false,
        callbackUrl: '/',
      });

      // 5. 홈페이지로 강제 리디렉트 (브라우저 새로고침)
      window.location.href = '/';
    } catch (error) {
      // 오류가 발생해도 홈페이지로 이동
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* 회원탈퇴 버튼 */}
      <div className={styles.withdrawButton}>
        <button 
          className={styles.withdrawBtn}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          회원탈퇴
        </button>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="회원탈퇴 확인"
        onConfirm={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="회원탈퇴"
        cancelText="취소"
        icon="warning"
        isLoading={isDeleting}
      >
        정말로 회원탈퇴를 하시겠습니까?<br />
        이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
      </ConfirmModal>

      {/* 에러 모달 */}
      <ConfirmModal
        isOpen={showErrorModal}
        title="오류 발생"
        onConfirm={() => setShowErrorModal(false)}
        confirmText="확인"
        icon="error"
      >
        {errorMessage}
      </ConfirmModal>
    </>
  );
}
