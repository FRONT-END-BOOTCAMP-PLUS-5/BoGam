'use client';

import React, { RefObject, useEffect } from 'react';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';

interface DaumPostcodeModalProps {
  postcodeRef: RefObject<HTMLDivElement | null>;
  showPostcode: boolean;
  onClose: () => void;
  onSearch?: () => void; // 주소 검색 실행 함수 추가
}

export const DaumPostcodeModal = ({
  postcodeRef,
  showPostcode,
  onClose,
  onSearch,
}: DaumPostcodeModalProps) => {
  // 모달이 열린 후 Postcode 실행
  useEffect(() => {
    if (showPostcode && onSearch) {
      // 모달이 완전히 렌더링된 후 실행
      const timer = setTimeout(() => {
        onSearch();
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [showPostcode, onSearch]);

  return (
    <ConfirmModal
      isOpen={showPostcode}
      title='주소 검색'
      onCancel={onClose}
      icon='info'
      confirmText=''
      cancelText='닫기'
      onConfirm={undefined}
    >
      <div 
        ref={postcodeRef} 
        className='w-full min-h-80 h-80 max-h-80 overflow-auto'
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
      />
    </ConfirmModal>
  );
};
