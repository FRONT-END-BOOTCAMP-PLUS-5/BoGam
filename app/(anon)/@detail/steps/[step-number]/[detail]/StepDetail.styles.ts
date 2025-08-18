export const styles = {
  // 모달 오버레이
  modalOverlay:
    'fixed inset-0 bg-brand-black/50 flex items-end justify-center z-50 animate-fadeIn',

  // 모달 콘텐츠
  modalContent:
    'bg-brand-light-blue w-full max-w-[480px] h-[calc(100vh-64px)] rounded-t-[20px] animate-slideUp mx-4',
  
  // 변환 효과가 있는 모달 콘텐츠
  modalContentWithTransform: (translateY: number, isDragging: boolean) => ({
    transform: `translateY(${translateY}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  }),

  // 로딩 및 에러 상태
  loadingContainer: 'flex items-center justify-center h-32',
  loadingText: 'text-brand-dark-gray',
  errorContainer: 'flex items-center justify-center h-32',
  errorText: 'text-brand-error',
} as const;
