export const styles = {
  // 메인 컨테이너
  container: 'transaction-search-component w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md',
  
  // 검색 폼
  searchForm: 'search-form space-y-6 mb-8',
  formTitle: 'form-title text-2xl font-bold text-gray-800 mb-6 text-center',
  
  // 주소 표시
  addressDisplay: 'address-display bg-gray-50 p-4 rounded-lg',
  addressValue: 'address-value text-lg font-medium text-gray-900 mt-2',
  
  // 폼 그룹
  formGroup: 'form-group space-y-2',
  formLabel: 'form-label block text-sm font-medium text-gray-700',
  formSelect: 'form-select w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  
  // 단지명 입력 그룹
  complexInputGroup: 'complex-input-group flex items-center space-x-3',
  complexDisplay: 'complex-display flex-1 bg-gray-50 px-3 py-2 rounded-md text-gray-700 min-h-[40px] flex items-center',
  fetchButton: 'fetch-button px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  
  // 검색 버튼
  searchButtonContainer: 'search-button-container flex justify-center pt-4',
  searchButton: 'search-button px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // 검색 결과
  searchResults: 'search-results mt-8',
  resultsTitle: 'results-title text-xl font-semibold text-gray-800 mb-4',
  resultsGrid: 'results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  
  // 결과 카드
  resultCard: 'result-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow',
  resultHeader: 'result-header flex justify-between items-start mb-3 pb-2 border-b border-gray-100',
  buildingName: 'building-name text-lg font-semibold text-gray-900 flex-1',
  transactionDate: 'transaction-date text-sm text-gray-500 ml-2',
  
  // 결과 상세
  resultDetails: 'result-details space-y-2',
  detailItem: 'detail-item flex justify-between items-center',
  label: 'label text-sm text-gray-600 font-medium',
  value: 'value text-sm text-gray-900',
  price: 'price text-lg font-bold text-green-600',
  
  // 로딩 상태
  loading: 'loading flex justify-center items-center py-8',
  loadingSpinner: 'loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
  
  // 에러 상태
  error: 'error bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center',
  
  // 반응형 디자인
  responsive: {
    sm: 'sm:px-4',
    md: 'md:px-6',
    lg: 'lg:px-8',
  },
  
  // 애니메이션
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
};
