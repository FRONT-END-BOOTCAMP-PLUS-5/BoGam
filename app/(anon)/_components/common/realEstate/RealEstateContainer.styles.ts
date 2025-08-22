export const styles = {
  container: 'max-w-6xl mx-auto p-6',
  title: 'text-2xl font-bold text-gray-800 mb-6',
  tabContainer: 'flex border-b border-gray-200 mb-6',
  tab: 'px-4 py-2 text-sm font-medium cursor-pointer border-b-2 transition-colors',
  activeTab: 'border-blue-500 text-blue-600',
  inactiveTab: 'border-transparent text-gray-500 hover:text-gray-700',
  tabContent: 'mt-6',
  loadingState: 'flex flex-col items-center justify-center py-12',
  loadingSpinner:
    'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4',
  loadingText: 'text-gray-600 text-center',
  loadingNote: 'text-sm text-gray-500 mt-2',
  emptyState: 'text-center py-12 text-gray-500',
};
