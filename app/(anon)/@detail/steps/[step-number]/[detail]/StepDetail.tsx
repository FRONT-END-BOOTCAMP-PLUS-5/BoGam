'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useDragToClose } from './_components/useDragToClose';
import { styles } from './StepDetail.styles';
import ModalDragHandle from './_components/ModalDragHandle';
import ModalContent from './_components/ModalContent';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { useModalStore } from '@libs/stores/modalStore';
import { TaxCertWrapperRef } from './_components/contents/TaxCertWrapper';
import { RealEstateTwoWayContent } from '@/(anon)/_components/common/realEstate/realEstateTwoWayContent/RealEstateTwoWayContent';
import { useRealEstateStore } from '@libs/stores/realEstateStore';

interface StepDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StepDetailPage({ isOpen, onClose }: StepDetailProps) {
  const [showSimpleAuthModal, setShowSimpleAuthModal] = useState(false);
  const taxCertWrapperRef = useRef<TaxCertWrapperRef | null>(null);

  // 전역 store 사용
  const {
    showTwoWayModal,
    twoWaySelectedAddress,
    response,
    handleAddressSelect,
    handleCloseTwoWayModal,
    setShowTwoWayModal,
    setTwoWaySelectedAddress,
  } = useRealEstateStore();

  const {
    isOpen: isModalOpen,
    content,
    confirmModal,
    cancelModal,
    closeModal,
  } = useModalStore();

  // onClose 함수를 확장하여 모달 초기화 포함
  const handleClose = useCallback(() => {
    // 모든 모달 상태 초기화
    setShowTwoWayModal(false);
    setTwoWaySelectedAddress(null);
    closeModal();
    setShowSimpleAuthModal(false);
    
    // 원래 onClose 호출
    onClose();
  }, [setShowTwoWayModal, setTwoWaySelectedAddress, closeModal, onClose]);

  const {
    dragState,
    modalRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
  } = useDragToClose(isOpen, handleClose);

  // 간편인증 모달 관련 핸들러들
  const handleShowSimpleAuthModal = () => {
    setShowSimpleAuthModal(true);
  };

  const handleSimpleAuthApprove = () => {
    // TaxCertWrapper의 ref를 통해 TaxCertContainer의 승인 로직 실행
    if (taxCertWrapperRef.current) {
      taxCertWrapperRef.current.handleSimpleAuthApprove();
    }
    setShowSimpleAuthModal(false);
  };

  const handleSimpleAuthCancel = () => {
    setShowSimpleAuthModal(false);
  };

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
    <div className={styles.modalOverlay} onClick={handleClose}>
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
          onClose={handleClose}
        />

        <ModalContent
          onShowSimpleAuthModal={handleShowSimpleAuthModal}
          onSimpleAuthApprove={handleSimpleAuthApprove}
          onSimpleAuthCancel={handleSimpleAuthCancel}
          taxCertContainerRef={taxCertWrapperRef}
        />
      </div>

      {/* modalStore의 모달 */}
      {isModalOpen && content && (
        <ConfirmModal
          isOpen={isModalOpen}
          title={content.title}
          icon={content.icon}
          onConfirm={content.onConfirm ? confirmModal : undefined}
          onCancel={cancelModal}
          confirmText={content.confirmText}
          cancelText={content.cancelText}
        >
          {content.content}
        </ConfirmModal>
      )}

      {/* 간편인증 추가인증 모달 */}
      <ConfirmModal
        isOpen={showSimpleAuthModal}
        title='🔐 간편인증 추가인증'
        onCancel={handleSimpleAuthCancel}
        cancelText='❌ 취소'
        icon='info'
        isLoading={false}
        onConfirm={handleSimpleAuthApprove}
        confirmText='✅ 승인'
      >
        <div className={styles.simpleAuthModalContent}>
          <p>📱 모바일에서 카카오 인증을 완료해주세요.</p>
          <p>✅ 인증 완료 후 아래 버튼을 클릭하여 승인해주세요.</p>
          <p className={styles.simpleAuthModalText}>
            * 4분 30초 내에 승인/취소를 완료해주세요.
          </p>
        </div>
      </ConfirmModal>

      {/* 2-way 인증 모달 */}
      <ConfirmModal
        isOpen={showTwoWayModal}
        title='부동산 목록에서 선택하세요'
        onCancel={handleCloseTwoWayModal || (() => {})}
        cancelText='취소'
        icon='info'
        isLoading={false}
        onConfirm={undefined}
      >
        <RealEstateTwoWayContent
          resAddrList={response?.resAddrList || []}
          selectedAddress={twoWaySelectedAddress}
          onAddressSelect={handleAddressSelect || (() => {})}
        />
      </ConfirmModal>
    </div>
  );
}
