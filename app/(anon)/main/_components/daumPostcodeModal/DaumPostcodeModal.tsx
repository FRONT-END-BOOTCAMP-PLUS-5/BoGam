'use client';

import React, { RefObject } from 'react';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';

interface DaumPostcodeModalProps {
  postcodeRef: RefObject<HTMLDivElement | null>;
  showPostcode: boolean;
  onClose: () => void;
}

export const DaumPostcodeModal = ({
  postcodeRef,
  showPostcode,
  onClose,
}: DaumPostcodeModalProps) => {
  console.log('postcodeRef',postcodeRef);
  console.log('showPostcode',showPostcode);
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
      />
    </ConfirmModal>
  );
};
