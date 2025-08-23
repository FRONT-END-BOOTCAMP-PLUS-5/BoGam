'use client';

import { useEffect } from 'react';
import { useDragToClose } from './_components/useDragToClose';
import { styles } from './StepDetail.styles';
import ModalDragHandle from './_components/ModalDragHandle';
import ModalContent from './_components/ModalContent';

interface StepDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StepDetailPage({ isOpen, onClose }: StepDetailProps) {
  const {
    dragState,
    modalRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
  } = useDragToClose(isOpen, onClose);

  // 모달이 열릴 때 배경 스크롤 차단
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // 모달이 닫힐 때 원래 상태로 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modalContent}
        style={styles.modalContentWithTransform(
          dragState.translateY,
          dragState.isDragging
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalDragHandle
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClose={onClose}
        />

        <ModalContent />
      </div>
    </div>
  );
}
