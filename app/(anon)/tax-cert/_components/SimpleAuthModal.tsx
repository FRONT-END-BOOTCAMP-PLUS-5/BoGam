'use client';

import React from 'react';
import styles from '@/(anon)/tax-cert/_components/SimpleAuthModal.module.css';

interface SimpleAuthModalProps {
  showModal: boolean;
  onClose: () => void;
  onApprove: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function SimpleAuthModal({ 
  showModal, 
  onClose, 
  onApprove, 
  onCancel, 
  isLoading 
}: SimpleAuthModalProps) {
  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🔐 간편인증 추가인증</h3>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseButton}
          >
            ✕
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.modalDescription}>
            <p>📱 모바일에서 카카오 인증을 완료해주세요.</p>
            <p>✅ 인증 완료 후 아래 버튼을 클릭하여 승인해주세요.</p>
          </div>
          <div className={styles.modalButtonContainer}>
            <button
              type="button"
              onClick={() => {
                onApprove();
                onClose();
              }}
              disabled={isLoading}
              className={styles.modalApproveButton}
            >
              {isLoading ? '🔄 승인 처리 중...' : '✅ 승인'}
            </button>
            <button
              type="button"
              onClick={() => {
                onCancel();
                onClose();
              }}
              disabled={isLoading}
              className={styles.modalCancelButton}
            >
              {isLoading ? '🔄 취소 처리 중...' : '❌ 취소'}
            </button>
          </div>
          <p className={styles.modalNote}>
            * 4분 30초 내에 승인/취소를 완료해주세요.
          </p>
        </div>
      </div>
    </div>
  );
} 