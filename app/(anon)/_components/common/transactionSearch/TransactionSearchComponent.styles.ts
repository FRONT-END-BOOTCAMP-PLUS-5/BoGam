export const styles = {
  // 검색 폼
  searchForm: 'search-form space-y-6 mb-8',
  formTitle: 'form-title text-2xl font-bold text-brand-black mb-6 text-center',
  
  // Form elements
  formGroup: 'form-group space-y-2',
  formLabel: 'form-label block text-sm font-medium text-brand-dark-gray',
  
  // Input wrapper for unit display
  inputWrapper: 'relative',
  inputWithUnit: 'pr-20',
  unitDisplay: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-brand-dark-gray font-medium',
  
  // Address display
  addressDisplay: 'address-display p-4 bg-brand-light-gray rounded-lg',
  addressValue: 'address-value text-lg font-medium text-brand-black',
  
  // Complex input
  complexInputGroup: 'complex-input-group flex items-center space-x-3',
  complexDisplay: 'complex-display flex-1 p-3 bg-brand-light-gray rounded-md text-brand-dark-gray',
  fetchButton: 'fetch-button px-4 py-2 !mt-0',
  
  // Search button
  searchButtonContainer: 'search-button-container text-center',
  searchButton: 'search-button w-full px-6 py-3 text-lg font-medium',
  
  // Search results
  searchResults: 'search-results space-y-6',
  resultsHeader: 'results-header flex justify-between items-center mb-6',
  resultsTitle: 'results-title text-2xl font-bold text-brand-black',
  
  // Empty state
  emptyState: 'empty-state text-center py-12',
  emptyStateTitle: 'empty-state-title text-brand-dark-gray text-lg mb-4',
  emptyStateSubtitle: 'empty-state-subtitle text-brand-light-gray text-sm',
  
  // Tab navigation
  tabNavigation: 'tab-navigation mb-6',
  tabContainer: 'flex border-b border-brand-light-gray',
  tab: 'px-6 py-3 text-sm font-medium rounded-t-lg transition-colors',
  activeTab: 'bg-brand text-white border-b-2 border-brand',
  inactiveTab: 'bg-brand-light-gray text-brand-dark-gray hover:bg-brand-light-gray',
  
  // Analysis card
  analysisCard: 'analysis-card bg-white p-6 rounded-lg border border-brand-light-gray shadow-sm mb-6',
  analysisTitle: 'analysis-title text-xl font-bold text-brand-black mb-4',
  analysisContent: 'analysis-content space-y-4',
  analysisRow: 'analysis-row flex justify-between items-center',
  analysisLabel: 'analysis-label text-sm font-medium text-brand-dark-gray',
  analysisValue: 'analysis-value text-lg font-semibold',
  analysisHighlight: 'analysis-highlight bg-brand-light-blue p-3 rounded-lg border-l-4 border-brand',
  analysisWarning: 'analysis-warning bg-brand-error/10 p-3 rounded-lg border-l-4 border-brand-error',
  analysisSafe: 'analysis-safe bg-brand-green/10 p-3 rounded-lg border-l-4 border-brand-green',
  
  // Analysis warning/safe styles
  warningTitle: 'font-semibold text-brand-error mb-1',
  warningText: 'text-brand-error',
  warningSubText: 'text-sm text-brand-error mt-1',
  safeTitle: 'font-semibold text-brand-green mb-1',
  safeText: 'text-brand-green',
  safeSubText: 'text-sm text-brand-green mt-1',
  
  // Saving state
  savingContainer: 'mt-4 text-center',
  savingText: 'text-sm text-brand-dark-gray',
  
  // Form hints and errors
  danjiHint: 'text-sm text-orange-600 mt-1',
  complexError: 'text-sm text-red-600 mt-2 text-center',
  
  // Average prices
  averagePrices: 'average-prices mb-6',
  averagePricesTitle: 'average-prices-title text-lg font-semibold text-brand-black mb-3',
  averagePricesGrid: 'average-prices-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  averagePriceCard: 'average-price-card bg-white p-4 rounded-lg border border-brand-light-gray shadow-sm',
  averagePriceContent: 'average-price-content text-center',
  averagePriceArea: 'text-2xl font-bold text-brand',
  averagePriceValue: 'text-lg font-semibold text-brand-black',
  averagePriceCount: 'text-sm text-brand-dark-gray',
  
  // Tab content
  tabContent: 'tab-content',
  
  // New search button
  newSearchButton: 'px-4 py-2',
  
  // 하단 여백
  bottomSpacer: 'pb-20',
} as const;
