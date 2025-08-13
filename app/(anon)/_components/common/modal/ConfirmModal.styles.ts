export const styles = {
  // 모달 오버레이 (배경 흐림 처리)
  overlay:
    'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn',

  // 모달 컨테이너
  modalContainer:
    'bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn',

  // 모달 헤더
  header: 'flex items-center gap-3 p-6 pb-4',
  title: 'text-lg font-semibold text-gray-900 flex-1',
  titleBackground: 'bg-blue-50 px-2 py-0.5 inline-block leading-tight',

  // 아이콘 스타일
  iconContainer: 'flex-shrink-0',
  warningIcon: 'w-6 h-6 text-amber-500',
  infoIcon: 'w-6 h-6 text-blue-500',
  errorIcon: 'w-6 h-6 text-red-500',
  successIcon: 'w-6 h-6 text-green-500',

  // 모달 본문
  content: 'px-6 pb-6',
  contentText: 'text-gray-700 leading-relaxed',

  // 버튼 컨테이너
  buttonContainer: 'flex gap-3 px-6 pb-6',

  // 버튼 스타일
  cancelButton:
    'flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300',
  confirmButton:
    'flex-1 px-4 py-3 text-white bg-blue-600 border border-blue-600 rounded-lg font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300',

  // 비활성화된 버튼
  disabledButton: 'opacity-50 cursor-not-allowed',

  // 에러 관련 스타일
  errorContainer: 'space-y-3',
  errorBox: 'p-3 bg-red-50 border border-red-200 rounded-lg',
  errorTitle: 'text-red-700 text-sm font-medium',
  errorMessage: 'text-red-600 text-sm mt-1',
} as const;

// 아이콘 타입별 스타일 함수
export const getIconStyle = (
  iconType: 'warning' | 'info' | 'error' | 'success'
) => {
  const iconStyles = {
    warning: styles.warningIcon,
    info: styles.infoIcon,
    error: styles.errorIcon,
    success: styles.successIcon,
  };
  return iconStyles[iconType] || styles.infoIcon;
};
