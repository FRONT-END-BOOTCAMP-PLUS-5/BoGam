'use client';

import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';

interface Props {
  isModalOpen: boolean;
  isErrorModalOpen: boolean;
  errorMessage: string;
  onConfirm: () => void;
  onCancelSuccess: () => void;
  onCancelError: () => void;
}

export function SignupModal({
  isModalOpen,
  isErrorModalOpen,
  errorMessage,
  onConfirm,
  onCancelSuccess,
  onCancelError,
}: Props) {
  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={onCancelSuccess}
        title='회원가입 완료'
        onConfirm={onConfirm}
        confirmText='로그인하기'
        icon='success'
      >
        회원가입이 완료되었습니다!
      </ConfirmModal>

      <ConfirmModal
        isOpen={isErrorModalOpen}
        onCancel={onCancelError}
        title='회원가입 오류'
        onConfirm={onCancelError}
        confirmText='수정'
        icon='error'
      >
        {errorMessage}
      </ConfirmModal>
    </>
  );
}
