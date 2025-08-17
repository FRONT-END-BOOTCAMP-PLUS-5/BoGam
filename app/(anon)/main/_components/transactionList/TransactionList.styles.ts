export const styles = {
  // 거래 목록 컨테이너
  transactionList: 'bg-white rounded-lg shadow-lg p-6',

  // 제목
  title: 'text-lg font-semibold text-gray-800 mb-4',

  // 빈 상태
  emptyState: 'text-center text-gray-500 py-8',

  // 거래 아이템들 컨테이너
  transactionItems: 'space-y-3',

  // 거래 아이템
  transactionItem:
    'border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200 cursor-pointer',
  transactionTitle: 'text-base font-semibold text-gray-800 mb-2',
  transactionDetails: 'space-y-1 mb-2',
  transactionDetail: 'text-sm text-gray-600',
  transactionAddress: 'text-sm text-gray-700 font-medium',
} as const;
