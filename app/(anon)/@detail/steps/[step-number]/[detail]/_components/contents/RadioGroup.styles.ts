const styles = {
  // JSON 데이터 표시를 위한 스타일
  container: 'p-5 max-w-4xl mx-auto',
  section: 'mb-6',
  sectionTitle: 'text-lg font-medium mb-2 text-black',
  sectionSubtitle: 'text-base font-medium mb-2 text-black',
  
  // 콘텐츠와 라디오버튼을 나란히 배치하는 레이아웃
  contentRow: 'flex gap-5 items-start',
  contentColumn: 'flex-1 min-w-0',
  radioColumn: 'flex-none min-w-[120px]',
  
  contents: 'mb-3',
  contentItem: 'text-base mb-1 last:mb-0 text-black leading-relaxed',
  
  summary: 'mt-3 text-base text-black',
  
  // 로딩 및 에러 상태 스타일
  loadingContainer: 'text-center py-10 text-black',
  errorContainer: 'text-center py-10 text-brand-error',
  noDataContainer: 'text-center py-10 text-black',

  // 스텝 데이터 표시 스타일
  stepDataSection: 'mt-8 p-5 border border-brand-light-gray rounded-lg bg-brand-light-gray',
  stepDataTitle: 'text-lg font-semibold mb-3 text-black',
  badgeContainer: 'flex flex-wrap gap-2',
  
  // 메시지 표시 스타일
  messagesContainer: 'mt-4 p-4 border border-brand-error rounded-lg bg-brand-error/10',
  messageItem: 'text-sm text-black mb-2 last:mb-0',
  linkContainer: 'mt-3 pt-3 border-t border-brand-error',
  link: 'text-sm text-brand-error hover:text-brand-dark-gray underline',
  
  // 저장 버튼 스타일
  saveButtonContainer: 'mt-6 text-center',
  saveButton: 'px-6 py-3 bg-brand-blue text-brand-white rounded-lg hover:bg-brand-dark-gray disabled:opacity-50 disabled:cursor-not-allowed',

  // 결과 메시지 및 링크 스타일
  resultSection: 'mt-8 p-6 border-2 border-brand rounded-lg bg-brand-white',
  errorMessage: 'text-lg font-semibold text-brand-error text-center leading-relaxed',
  successMessage: 'text-lg font-semibold text-brand text-center leading-relaxed',
  linksContainer: 'mt-4 flex flex-col gap-3 items-center',
};

export default styles;
