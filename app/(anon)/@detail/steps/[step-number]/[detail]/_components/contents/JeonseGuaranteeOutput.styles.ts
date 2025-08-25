export const jeonseGuaranteeOutputStyles = {
  container: 'p-6 bg-brand-white',
  header: 'mb-6',
  title: 'text-xl font-bold text-brand-black mb-2',
  subtitle: 'text-sm text-brand-dark-gray',

  // 로딩 상태
  loadingContainer: 'text-center py-8',
  loadingSpinner:
    'animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4',
  loadingText: 'text-brand-dark-gray',
  loadingStatus: 'text-sm text-brand-dark-gray mt-2',

  // 데이터 컨테이너
  dataContainer: 'space-y-4',

  // 카드 스타일
  card: 'p-6 bg-gradient-to-r from-brand-light-blue to-brand-white rounded-lg border-2 border-brand shadow-sm',
  cardContent: 'text-center',
  cardHeader: 'mb-4',
  cardIcon:
    'w-16 h-16 bg-brand-light-blue rounded-full flex items-center justify-center mx-auto mb-3',
  cardIconText: 'text-brand text-2xl',
  cardTitle: 'text-lg font-bold text-brand-black mb-2',

  // 금액 표시
  amountContainer: 'bg-brand-white rounded-lg p-4 border border-brand',
  amountContent: 'text-center',
  amountValue: 'text-2xl font-bold text-brand mb-1',
  amountLabel: 'text-sm text-brand-dark-gray',

  // 빈 상태
  emptyContainer: 'text-center py-8',
  emptyIcon:
    'w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mx-auto mb-4',
  emptyIconText: 'text-brand-dark-gray text-2xl',
  emptyTitle: 'font-semibold text-brand-black mb-2',
  emptyDescription: 'text-brand-dark-gray',
  emptyHint: 'text-sm text-brand-dark-gray mt-2',
} as const;
