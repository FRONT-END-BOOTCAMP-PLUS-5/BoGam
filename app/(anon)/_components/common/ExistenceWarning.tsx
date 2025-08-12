"use client";

import React from 'react';
import styles from './ExistenceWarning.module.css';

interface ExistenceWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  updatedAt?: string;
  isLoading?: boolean;
}

export default function ExistenceWarning({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  updatedAt,
  isLoading = false
}: ExistenceWarningProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          {updatedAt && (
            <p className={styles.updatedAt}>
              마지막 업데이트: {updatedAt}
            </p>
          )}
        </div>
        
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
