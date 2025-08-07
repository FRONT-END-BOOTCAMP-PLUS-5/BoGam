"use client";

import React from 'react';
import styles from './ExistenceWarning.module.css';

interface ExistenceWarningProps {
  exists: boolean;
  updatedAt?: string;
  type: 'tax-cert' | 'real-estate';
  onClose: () => void;
}

export default function ExistenceWarning({ exists, updatedAt, type, onClose }: ExistenceWarningProps) {
  if (!exists) {
    return null;
  }

  const typeLabel = type === 'tax-cert' ? '납세확인서' : '등기부등본';
  const formattedDate = updatedAt ? new Date(updatedAt).toLocaleString() : '알 수 없음';

  return (
    <div className={styles.warningOverlay}>
      <div className={styles.warningModal}>
        <div className={styles.warningHeader}>
          <h3 className={styles.warningTitle}>⚠️ 기존 데이터 발견</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        
        <div className={styles.warningContent}>
          <p className={styles.warningMessage}>
            이미 저장된 {typeLabel} 데이터가 있습니다.
          </p>
          
          <div className={styles.warningDetails}>
            <div className={styles.detailItem}>
              <strong>마지막 업데이트:</strong>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className={styles.warningActions}>
            <button onClick={onClose} className={styles.continueButton}>
              계속 진행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
