'use client';

import React, { useState } from 'react';
import { styles } from './RiskAssessmentSaveButton.styles';
import { useModalStore } from '@libs/stores/modalStore';

interface RiskAssessmentSaveButtonProps {
  isEnabled: boolean;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

export const RiskAssessmentSaveButton: React.FC<
  RiskAssessmentSaveButtonProps
> = ({ isEnabled, onSave, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModalStore();

  const handleSave = async () => {
    if (!isEnabled || isLoading) return;

    setIsLoading(true);
    try {
      await onSave();
      openModal({
        title: '저장 완료',
        content: '위험도 검사 결과가 저장되었습니다.',
        icon: 'success',
        confirmText: '확인',
      });
    } catch (error) {
      console.error('위험도 검사 결과 저장 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
      openModal({
        title: '저장 실패',
        content: errorMessage,
        icon: 'error',
        confirmText: '확인',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={!isEnabled || isLoading || disabled}
      className={styles.button}
    >
      {isLoading ? '저장 중...' : '저장'}
    </button>
  );
};
