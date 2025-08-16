import { useCallback, useState, useEffect, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  startY: number;
  currentY: number;
  translateY: number;
}

export const useDragToClose = (isOpen: boolean, onClose: () => void) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    translateY: 0,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragState((prev) => ({
      ...prev,
      startY: touch.clientY,
      currentY: touch.clientY,
      isDragging: true,
    }));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragState.isDragging) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - dragState.startY;

    // 위로는 드래그 제한, 아래로만 드래그 허용
    if (deltaY > 0) {
      setDragState((prev) => ({
        ...prev,
        translateY: deltaY,
        currentY: touch.clientY,
      }));
    }
  };

  const handleTouchEnd = () => {
    if (!dragState.isDragging) return;

    setDragState((prev) => ({ ...prev, isDragging: false }));
    const deltaY = dragState.currentY - dragState.startY;

    // 드래그 거리가 100px 이상이면 모달 닫기
    if (deltaY > 100) {
      onClose();
    } else {
      // 원래 위치로 복귀
      setDragState((prev) => ({ ...prev, translateY: 0 }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragState((prev) => ({
      ...prev,
      startY: e.clientY,
      currentY: e.clientY,
      isDragging: true,
    }));
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.isDragging) return;

    const deltaY = e.clientY - dragState.startY;

    // 위로는 드래그 제한, 아래로만 드래그 허용
    if (deltaY > 0) {
      setDragState((prev) => ({
        ...prev,
        translateY: deltaY,
        currentY: e.clientY,
      }));
    }
  }, [dragState.isDragging, dragState.startY]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;

    setDragState((prev) => ({ ...prev, isDragging: false }));
    const deltaY = dragState.currentY - dragState.startY;

    // 드래그 거리가 100px 이상이면 모달 닫기
    if (deltaY > 100) {
      onClose();
    } else {
      // 원래 위치로 복귀
      setDragState((prev) => ({ ...prev, translateY: 0 }));
    }
  }, [dragState.isDragging, dragState.currentY, dragState.startY, onClose]);

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (dragState.isDragging) {
      const handleGlobalMouseMove = (e: globalThis.MouseEvent) =>
        handleMouseMove(e as unknown as React.MouseEvent);
      const handleGlobalMouseUp = () => handleMouseUp();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // 모달이 열릴 때 translateY 초기화
  useEffect(() => {
    if (isOpen) {
      setDragState((prev) => ({ ...prev, translateY: 0 }));
    }
  }, [isOpen]);

  return {
    dragState,
    modalRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
  };
};
