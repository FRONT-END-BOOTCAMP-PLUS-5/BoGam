'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import {
  styles,
  getIconStyle,
  getTitleBackgroundColor,
  getIconContainerStyle,
} from './ConfirmModal.styles';
import Button from '@/(anon)/_components/common/button/Button';

// ConfirmModal Props 인터페이스
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'info' | 'error' | 'success';
  isLoading?: boolean;
  children?: React.ReactNode;
}

// 아이콘 컴포넌트 - brand 컬러 원형 테두리 + brand 컬러 아이콘
const IconComponent = ({
  iconType,
}: {
  iconType: 'warning' | 'info' | 'error' | 'success';
}) => {
  const iconProps = {
    size: 20,
    className: getIconStyle(iconType),
  };

  const renderIcon = () => {
    switch (iconType) {
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'error':
        return (
          <span className={`${getIconStyle(iconType)} ${styles.textIcon}`}>
            <X strokeWidth={2.5} />
          </span>
        );
      case 'success':
        return <Check {...iconProps} strokeWidth={2.5} />;
      case 'info':
      default:
        return (
          <span className={`${getIconStyle(iconType)} ${styles.textIcon}`}>
            i
          </span>
        );
    }
  };

  return <div className={getIconContainerStyle(iconType)}>{renderIcon()}</div>;
};

export function ConfirmModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  icon = 'info',
  isLoading = false,
  children,
}: ConfirmModalProps) {
  // ESC 키로 모달 닫기 (로딩 중에는 비활성화)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onCancel]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Modal confirm error:', error);
      // 에러는 부모 컴포넌트에서 처리하도록 다시 throw
      throw error;
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div
      className={styles.overlay}
      onClick={isLoading ? undefined : handleCancel}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <IconComponent iconType={icon} />
          <h2 className={styles.title}>
            <div className={styles.titleContainer}>
              <div className={styles.titleTop}></div>
              <div className={styles.titleText}>{title}</div>
              <div
                className={`${styles.titleBottom} ${getTitleBackgroundColor(
                  icon
                )}`}
              ></div>
            </div>
          </h2>
        </div>

        {/* 본문 - children 렌더링 */}
        {children && (
          <div className={styles.content}>
            <div className={styles.contentText}>{children}</div>
          </div>
        )}

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <Button
            variant='secondary'
            onClick={handleCancel}
            disabled={isLoading}
            className={styles.modalButton}
          >
            {cancelText}
          </Button>
          <Button
            variant='primary'
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className={styles.modalButton}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
