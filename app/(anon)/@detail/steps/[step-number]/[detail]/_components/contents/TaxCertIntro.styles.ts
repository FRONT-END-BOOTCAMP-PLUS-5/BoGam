const styles = {
  // 컨테이너 스타일
  container: 'space-y-6',
  
  // 내용 섹션 스타일
  contentSection: 'space-y-3',
  contentSectionTitle: 'text-lg font-semibold text-gray-800',
  contentSectionContent: 'space-y-2',
  contentText: 'text-gray-600 leading-relaxed',
  
  // 이미지 스타일
  imageContainer: 'flex justify-center',
  imageWrapper: 'border border-gray-200 rounded-lg overflow-hidden shadow-sm',
  image: 'max-w-full h-auto',
  
  // 체크리스트 스타일
  checklistContainer: 'mt-6',
  checklistTitle: 'font-semibold text-brand-black mb-3',
  checklistGrid: 'grid grid-cols-1 gap-3',
  
  // 체크리스트 아이템 스타일
  checklistItem: 'p-3 rounded-lg border transition-colors duration-200 cursor-pointer',
  checklistItemMatch: 'bg-brand-green/20',
  checklistItemMismatch: 'bg-brand-error/20',
  
  // 체크리스트 아이템 내부 스타일
  checklistItemContent: 'flex flex-col gap-2 mb-2',
  checklistItemControls: 'flex items-center gap-4',
  checkboxLabel: 'flex items-center gap-2 cursor-pointer',
  checkboxInput: 'w-4 h-4 text-brand-blue border-brand-black focus:ring-brand-blue appearance-none rounded border-2 checked:bg-brand-blue checked:border-brand-blue',
  checkboxText: 'text-sm text-brand-black',
  checklistItemLabel: 'font-medium text-brand-black text-sm',
};

export default styles;
