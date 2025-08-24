'use client';

import React, { useState } from 'react';
import { styles } from './RiskAssessmentSaveButton.styles';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';

interface RiskAssessmentSaveButtonProps {
  isEnabled: boolean;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

export const RiskAssessmentSaveButton: React.FC<
  RiskAssessmentSaveButtonProps
> = ({ isEnabled, onSave, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    if (!isEnabled || isLoading) return;

    setIsLoading(true);
    try {
      await onSave();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('위험도 검사 결과 저장 중 오류:', error);
      setErrorMessage(
        error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.'
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
  };

  const handleErrorConfirm = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={!isEnabled || isLoading || disabled}
        className={styles.button}
      >
        {isLoading ? '저장 중...' : '저장'}
      </button>

      {/* 성공 모달 */}
      <ConfirmModal
        isOpen={showSuccessModal}
        title='저장 완료'
        icon='success'
        onConfirm={handleSuccessConfirm}
        confirmText='확인'
      >
        위험도 검사 결과가 저장되었습니다.
      </ConfirmModal>

      {/* 에러 모달 */}
      <ConfirmModal
        isOpen={showErrorModal}
        title='저장 실패'
        icon='error'
        onConfirm={handleErrorConfirm}
        confirmText='확인'
      >
        {errorMessage}
      </ConfirmModal>
    </>
  );
};
