export const styles = {
  // 메인 컨테이너 스타일
  container: 'space-y-4',

  // 설명 텍스트 스타일
  description: 'text-brand-dark-gray text-sm',

  // 부동산 목록 컨테이너 스타일
  addressListContainer: 'space-y-3 max-h-60 overflow-y-auto',

  // 부동산 아이템 스타일
  addressItem: 'p-3 border rounded-lg cursor-pointer transition-colors',
  addressItemSelected: 'border-brand-blue bg-brand-light-blue',
  addressItemDefault: 'border-brand-light-gray hover:border-brand-dark-gray',

  // 부동산 아이템 내부 스타일
  addressItemContent: 'flex-1',
  addressLocation: 'font-medium text-brand-black mb-1',
  addressUniqueNo: 'text-sm text-brand-dark-gray mb-1',
  addressOwner: 'text-sm text-brand-dark-gray',
} as const;
