export const styles = {
  // 모달 오버레이
  overlay:
    'fixed inset-0 bg-brand-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 touch-none',

  // 모달 컨테이너
  modalContainer:
    'bg-brand-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col',

  // 모달 헤더
  modalHeader:
    'flex items-center justify-between p-6 border-b border-brand-light-gray flex-shrink-0',
  modalTitle: 'text-xl font-semibold text-brand-black',
  closeButton:
    'text-brand-dark-gray hover:text-brand-black text-2xl font-bold cursor-pointer p-2 hover:bg-brand-light-gray rounded-full transition-colors',

  // 모달 본문
  modalBody: 'p-6 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain',

  // 섹션
  searchSection: 'mb-6',
  resultSection: 'mt-6',
  sectionTitle: 'text-lg font-semibold text-brand-black mb-4',

  // 입력 그룹
  inputGroup: 'mb-4 relative group',
  label: 'block text-sm font-medium text-brand-dark-gray mb-2',
  input:
    'w-full px-3 py-2 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
  select:
    'w-full px-3 py-2 pr-10 border border-brand-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white appearance-none',

  // 검색 버튼
  searchButton:
    'w-full px-4 py-3 bg-brand text-brand-white rounded-lg hover:bg-brand-90 transition-colors duration-200 disabled:bg-brand-light-gray disabled:cursor-not-allowed font-medium',

  // 자동 설정 안내
  autoSettingNote: 'text-xs text-brand-blue mt-1',

  // 커스텀 드롭다운 화살표
  selectArrow:
    'absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-dark-gray',

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
