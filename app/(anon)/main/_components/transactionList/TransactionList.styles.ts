export const styles = {
  // 거래 목록 컨테이너
  transactionList: 'w-full bg-brand-white flex flex-col h-full',

  // 제목
  title: 'text-lg font-semibold text-brand-black mb-4',

  // 헤더
  transactionHeader: 'flex items-center justify-between mb-4 flex-shrink-0',
  transactionCount: 'text-sm text-brand-blue font-medium',

  // 빈 상태
  emptyState: 'text-center text-brand-dark-gray py-8',

  // 로딩 상태
  loadingState: 'text-center text-brand-dark-gray py-8',
  loadingSpinner:
    'inline-block w-8 h-8 border-4 border-brand-light-gray border-t-brand rounded-full animate-spin mb-4',
  loadingNote: 'text-xs text-brand-dark-gray mt-2',

  // 거래 아이템들 컨테이너
  transactionItems: 'space-y-3 overflow-y-auto flex-1',

  // 거래 아이템
  transactionItem:
    'border border-brand-light-gray rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer',
  transactionTitle: 'text-base font-semibold text-brand-black mb-2',
  transactionDetails: 'space-y-2 mb-2',
  transactionDetail: 'text-sm text-brand-dark-gray',

  // 수직 정렬을 위한 새로운 스타일
  detailRow: 'flex justify-between items-center',
  detailLabel: 'text-sm text-brand-dark-gray font-medium',
  detailValue: 'text-sm text-brand-black font-semibold',

  transactionDate: 'text-sm text-brand-blue font-medium mb-1',
  transactionAddress: 'text-sm text-brand-dark-gray font-medium',

  // 페이지네이션
  pagination: 'flex items-center justify-center gap-4 mt-4 pt-4 border-t border-brand-light-gray flex-shrink-0',
  paginationButton: 'flex items-center justify-center w-8 h-8 rounded-lg border border-brand-light-gray bg-brand-white text-brand-dark-gray hover:bg-brand-light-gray hover:text-brand-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
  pageIndicators: 'flex items-center gap-2',
  pageIndicator: 'flex items-center justify-center w-8 h-8 rounded-lg border border-brand-light-gray bg-brand-white text-brand-dark-gray hover:bg-brand-light-gray hover:text-brand-black transition-colors',
  activePageIndicator: 'bg-brand-90 text-brand-white border-brand-blue',
} as const;
