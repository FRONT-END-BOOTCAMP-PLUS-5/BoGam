export const styles = {
  // 모달 오버레이
  modalOverlay:
    'fixed inset-0 bg-brand-black/50 flex items-end justify-center z-[9999] animate-fadeIn',

  // 모달 콘텐츠
  modalContent:
    'bg-brand-white w-full max-w-[480px] h-[calc(100vh-4rem)] rounded-t-[20px] animate-slideUp',
  
  // 변환 효과가 있는 모달 콘텐츠
  modalContentWithTransform: (translateY: number, isDragging: boolean) => ({
    transform: `translateY(${translateY}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  }),
} as const;
