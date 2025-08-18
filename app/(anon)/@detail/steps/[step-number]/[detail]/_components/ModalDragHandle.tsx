'use client';

import { styles } from '../StepDetail.styles';

interface ModalDragHandleProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function ModalDragHandle({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
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

      {/* Divider */}
      {/* <div className={styles.divider}></div> */}
    </>
  );
}
