'use client';

import { X } from 'lucide-react';
import { styles } from './ModalDragHandle.styles';

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
        className={styles.dragHandle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className={styles.dragIndicator}></div>
      </div>

      {/* Modal Header */}
      <div className={styles.modalHeader}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Divider */}
      {/* <div className={styles.divider}></div> */}
    </>
  );
}
