export const styles = {
  // 모달 오버레이
  overlay:
    'fixed inset-0 bg-brand-black bg-opacity-50 flex items-center justify-center z-50 p-4',

  // 모달 컨테이너
  modalContainer:
    'bg-brand-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden',
  postcodeContainer:
    'bg-brand-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden',

  // 모달 헤더
  modalHeader:
    'flex items-center justify-between p-4 border-b border-brand-light-gray',
  modalTitle: 'text-lg font-semibold text-brand-black',
  closeButton:
    'text-brand-dark-gray hover:text-brand-black text-2xl font-bold cursor-pointer',
  postcodeHeader:
    'flex items-center justify-between p-4 border-b border-brand-light-gray',

  // 모달 본문
  modalBody: 'p-4',
  postcodeFrame: 'w-full h-[600px] border-0',
} as const;
