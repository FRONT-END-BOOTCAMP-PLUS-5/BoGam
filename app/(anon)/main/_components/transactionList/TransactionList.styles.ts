export const styles = {
  // 거래 목록 컨테이너
  transactionList: 'bg-brand-white rounded-lg shadow-lg p-6',

  // 제목
  title: 'text-lg font-semibold text-brand-black mb-4',

  // 빈 상태
  emptyState: 'text-center text-brand-dark-gray py-8',

  // 거래 아이템들 컨테이너
  transactionItems: 'space-y-3',

  // 거래 아이템
  transactionItem:
    'border border-brand-light-gray rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer',
  transactionTitle: 'text-base font-semibold text-brand-black mb-2',
  transactionDetails: 'space-y-1 mb-2',
  transactionDetail: 'text-sm text-brand-dark-gray',
  transactionAddress: 'text-sm text-brand-dark-gray font-medium',
} as const;
