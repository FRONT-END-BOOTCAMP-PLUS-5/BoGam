export const styles = {
  container: 'space-y-6',
  resultsHeader: 'flex justify-between items-center mb-6',
  resultsTitle: 'text-2xl font-bold text-brand-black',
  
  // Empty state
  emptyState: 'text-center py-12',
  emptyStateTitle: 'text-brand-dark-gray text-lg mb-4',
  emptyStateSubtitle: 'text-brand-light-gray text-sm',
  
  // Analysis card
  analysisCard: 'bg-white p-6 rounded-lg border border-brand-light-gray shadow-sm mb-6',
  analysisTitle: 'text-xl font-bold text-brand-black mb-4',
  analysisContent: 'space-y-4',
  analysisRow: 'flex justify-between items-center',
  analysisLabel: 'text-sm font-medium text-brand-dark-gray',
  analysisValue: 'text-lg font-semibold',
  analysisWarning: 'bg-brand-error/10 p-3 rounded-lg border-l-4 border-brand-error',
  analysisSafe: 'bg-brand-green/10 p-3 rounded-lg border-l-4 border-brand-green',
  
  // Analysis warning/safe styles
  warningTitle: 'font-semibold text-brand-error mb-1',
  warningText: 'text-brand-error',
  warningSubText: 'text-sm text-brand-error mt-1',
  safeTitle: 'font-semibold text-brand-green mb-1',
  safeText: 'text-brand-green',
  safeSubText: 'text-sm text-brand-green mt-1',
  
  // Average prices
  averagePrices: 'mb-6',
  averagePricesTitle: 'text-lg font-semibold text-brand-black mb-3',
  averagePricesGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  averagePriceCard: 'bg-white p-4 rounded-lg border border-brand-light-gray shadow-sm',
  averagePriceContent: 'text-center',
  averagePriceArea: 'text-2xl font-bold text-brand',
  averagePriceValue: 'text-lg font-semibold text-brand-black',
  averagePriceCount: 'text-sm text-brand-dark-gray',
  
  // New search button
  newSearchButton: 'px-4 py-2',
  
} as const;
