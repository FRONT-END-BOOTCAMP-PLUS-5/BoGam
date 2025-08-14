'use client';

import { useEffect } from 'react';
import { useDragToClose } from './hooks/useDragToClose';
import { useGetStepDetail } from './hooks/useGetStepDetail';
import { styles } from './StepDetail.styles';
import ModalDragHandle from './components/ModalDragHandle';
import ModalContent from './components/ModalContent';

interface StepDetailProps {
  userAddressNickname: string;
  stepNumber: string;
  detail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StepDetailPage({
  userAddressNickname,
  stepNumber,
  detail,
  isOpen,
  onClose,
}: StepDetailProps) {
  const {
    data: stepData,
    isLoading,
    isError,
  } = useGetStepDetail({
    stepNumber,
    detail,
    userAddressNickname,
  });
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

  if (isLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className='flex items-center justify-center h-32'>
            <div className='text-gray-500'>로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !stepData) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-center justify-center h-32'>
            <div className='text-red-500'>
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modalContent}
        style={{
          transform: `translateY(${dragState.translateY}px)`,
          transition: dragState.isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalDragHandle
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        />

        <ModalContent stepData={stepData} onClose={onClose} />
      </div>
    </div>
  );
}
