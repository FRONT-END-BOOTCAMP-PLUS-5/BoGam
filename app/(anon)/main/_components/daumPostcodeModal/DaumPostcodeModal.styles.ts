export const styles = {
  // 모달 오버레이
  overlay:
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',

  // 모달 컨테이너
  modalContainer:
    'bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden',
  postcodeContainer:
    'bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden',

  // 모달 헤더
  modalHeader: 'flex items-center justify-between p-4 border-b border-gray-200',
  modalTitle: 'text-lg font-semibold text-gray-800',
  closeButton:
    'text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer',
  postcodeHeader:
    'flex items-center justify-between p-4 border-b border-gray-200',

  // 모달 본문
  modalBody: 'p-4',
  postcodeFrame: 'w-full h-[600px] border-0',
} as const;
