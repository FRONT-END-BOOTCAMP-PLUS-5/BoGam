'use client';

import { X } from 'lucide-react';
import { modalDragHandleStyles } from './ModalDragHandle.styles';

interface ModalDragHandleProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export default function ModalDragHandle({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onClose,
}: ModalDragHandleProps) {
  return (
    <>
      {/* Drag Handle */}
      <div
        className={modalDragHandleStyles.dragHandle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className={modalDragHandleStyles.dragIndicator}></div>
      </div>

      {/* Modal Header */}
      <div className={modalDragHandleStyles.modalHeader}>
        <button className={modalDragHandleStyles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Divider */}
      {/* <div className={modalDragHandleStyles.divider}></div> */}
    </>
  );
}
