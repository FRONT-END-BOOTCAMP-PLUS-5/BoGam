'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import {
  styles,
  getIconStyle,
  getTitleBackgroundColor,
  getIconContainerStyle,
} from './ConfirmModal.styles';
import { useModalStore } from './modalStore';

// 아이콘 컴포넌트 - brand 컬러 동그라미 + brand 컬러 아이콘
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
        return <XCircle {...iconProps} />;
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'info':
      default:
        return <Info {...iconProps} />;
    }
  };

  return <div className={getIconContainerStyle(iconType)}>{renderIcon()}</div>;
};

export function ConfirmModal() {
  const {
    isOpen,
    content,
    isLoading,
    error,
    closeModal,
    confirmModal,
    cancelModal,
    clearError,
  } = useModalStore();

  // ESC 키로 모달 닫기 (로딩 중에는 비활성화)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        closeModal();
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
  }, [isOpen, isLoading, closeModal]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen || !content) {
    return null;
  }

  const {
    title,
    content: modalContent,
    confirmText = '확인',
    cancelText = '취소',
    icon = 'info',
  } = content;

  // 에러가 있으면 에러 아이콘으로 변경
  const displayIcon = error ? 'error' : icon;

  return (
    <div
      className={styles.overlay}
      onClick={isLoading ? undefined : closeModal}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <IconComponent iconType={displayIcon} />
          <h2 className={styles.title}>
            <div className={styles.titleContainer}>
              <div className={styles.titleTop}></div>
              <div className={styles.titleText}>{title}</div>
              <div
                className={`${styles.titleBottom} ${getTitleBackgroundColor(
                  displayIcon
                )}`}
              ></div>
            </div>
          </h2>
        </div>

        {/* 본문 */}
        <div className={styles.content}>
          {error ? (
            <div className={styles.errorContainer}>
              {typeof modalContent === 'string' ? (
                <p className={styles.contentText}>{modalContent}</p>
              ) : (
                <div className={styles.contentText}>{modalContent}</div>
              )}
              <div className={styles.errorBox}>
                <p className={styles.errorTitle}>오류가 발생했습니다:</p>
                <p className={styles.errorMessage}>{error}</p>
              </div>
            </div>
          ) : typeof modalContent === 'string' ? (
            // "이미 사용 중인 닉네임입니다" 같은 에러 메시지는 brand-error 색상 적용
            <p
              className={
                modalContent.includes('이미 사용 중인') ||
                modalContent.includes('오류') ||
                modalContent.includes('실패')
                  ? styles.errorText
                  : styles.contentText
              }
            >
              {modalContent}
            </p>
          ) : (
            <div className={styles.contentText}>{modalContent}</div>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            type='button'
            className={`${styles.cancelButton} ${
              isLoading ? styles.disabledButton : ''
            }`}
            onClick={cancelModal}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type='button'
            className={`${styles.confirmButton} ${
              isLoading ? styles.disabledButton : ''
            }`}
            onClick={confirmModal}
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
