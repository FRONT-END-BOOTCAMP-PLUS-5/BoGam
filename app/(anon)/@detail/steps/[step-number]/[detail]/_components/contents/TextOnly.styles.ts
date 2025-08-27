const styles = {
  // JSON 데이터 표시를 위한 스타일
  container: 'p-5 max-w-4xl mx-auto',
  section: 'mb-6',
  sectionTitle: 'text-lg font-bold mb-2 text-black',
  sectionSubtitle: 'text-base font-medium mb-2 text-black',
  subtitlesContainer: 'mb-4 space-y-2',
  contents: 'mb-3',
  contentItem: 'block text-base mb-1 last:mb-0 text-black leading-relaxed',
  contentSectionsContainer: 'space-y-6',
  contentSection: 'mb-6',
  summary: 'mt-3 p-4 bg-brand/10 border border-brand/20 rounded-lg text-base text-brand-black font-medium',

  // 로딩 및 에러 상태 스타일
  loadingContainer: 'text-center py-10 text-black',
  errorContainer: 'text-center py-10 text-brand-error',
  noDataContainer: 'text-center py-10 text-black',

  // 스텝 데이터 표시 스타일
  stepDataSection: 'mt-8 p-5 border border-brand-light-gray rounded-lg bg-brand-light-gray',
  stepDataTitle: 'text-lg font-semibold mb-3 text-black',
  badgeContainer: 'flex flex-wrap gap-2',

  // 이미지 스타일
  imageContainer: 'my-6 flex justify-center',
  contentImage: 'rounded-lg shadow-md max-w-full h-auto',

  // 버튼 스타일
  buttonContainer: 'mt-6 flex justify-center',
  buttonsContainer: 'mt-6 flex flex-col gap-2 items-center',
};

export default styles;
