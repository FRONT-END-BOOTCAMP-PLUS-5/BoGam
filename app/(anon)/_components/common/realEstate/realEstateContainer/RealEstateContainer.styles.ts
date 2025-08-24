export const styles = {
  container: 'max-w-6xl mx-auto p-6',
  title: 'text-2xl font-bold text-brand-black mb-6',
  tabContainer: 'flex border-b border-brand-light-gray mb-6',
  tab: 'rounded-t-lg px-4 py-2 text-sm font-medium cursor-pointer border-b-2 transition-colors',
  activeTab: 'bg-brand-90 text-brand-white ',
  inactiveTab: 'border-transparent text-brand-dark-gray hover:text-brand-black',
  tabContent: 'mt-6',
  loadingState: 'flex flex-col items-center justify-center py-12',
  loadingSpinner:
    'animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-4',
  loadingText: 'text-brand-dark-gray text-center',
  loadingNote: 'text-sm text-brand-dark-gray mt-2',
  emptyState: 'text-center py-12 text-brand-dark-gray',
};
