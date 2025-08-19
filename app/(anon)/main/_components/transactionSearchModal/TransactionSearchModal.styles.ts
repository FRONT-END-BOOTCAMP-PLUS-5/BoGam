export const styles = {
  // 모달 오버레이
  overlay:
    'fixed inset-0 bg-brand-black bg-opacity-50 flex items-center justify-center z-50 p-4',

  // 모달 컨테이너
  modalContainer:
    'bg-brand-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden',

  // 모달 헤더
  modalHeader:
    'flex items-center justify-between p-6 border-b border-brand-light-gray',
  modalTitle: 'text-xl font-semibold text-brand-black',
  closeButton:
    'text-brand-dark-gray hover:text-brand-black text-2xl font-bold cursor-pointer p-2 hover:bg-brand-light-gray rounded-full transition-colors',

  // 모달 본문
  modalBody: 'p-6 max-h-[70vh] overflow-y-auto',

  // 섹션
  searchSection: 'mb-6',
  resultSection: 'mt-6',
  sectionTitle: 'text-lg font-semibold text-brand-black mb-4',

  // 입력 그룹
  inputGroup: 'mb-4',
  label: 'block text-sm font-medium text-brand-dark-gray mb-2',
  input:
    'w-full px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
  select:
    'w-full px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white',

  // 검색 버튼
  searchButton:
    'w-full px-4 py-3 bg-brand text-brand-white rounded-lg hover:bg-brand-90 transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed font-medium',

  // 오류 메시지
  errorMessage:
    'bg-brand-red bg-opacity-10 border border-brand-red text-brand-red px-4 py-3 rounded-lg mb-4',

  // 단지 목록
  danjiList: 'space-y-3',
  danjiItem:
    'border border-brand-light-gray rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-brand',
  danjiName: 'text-lg font-semibold text-brand-black mb-2',
  danjiAddress: 'text-sm text-brand-dark-gray mb-2',
  danjiInfo: 'flex flex-wrap gap-4 text-xs text-brand-dark-gray',
} as const;
