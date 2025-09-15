'use client';

import React, { useState } from 'react';
import { styles } from './RiskAssessmentSaveButton.styles';
import { useToastStore } from '@libs/stores/toastStore';

interface RiskAssessmentSaveButtonProps {
  isEnabled: boolean;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

export const RiskAssessmentSaveButton: React.FC<
  RiskAssessmentSaveButtonProps
> = ({ isEnabled, onSave, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToastStore();

  const handleSave = async () => {
    if (!isEnabled || isLoading) return;

    setIsLoading(true);
    try {
      await onSave();
      showSuccess('저장 되었습니다.');
    } catch (error) {
      console.error('위험도 검사 결과 저장 중 오류:', error);
      showError('저장에 실패 했습니다.');
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
