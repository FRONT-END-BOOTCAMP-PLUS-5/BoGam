export const styles = {
  container: 'min-h-screen bg-brand-light-gray p-6',
  wrapper: 'max-w-6xl mx-auto',
  mainCard: 'bg-brand-white rounded-lg shadow-lg p-6',
  header: 'mb-6',
  title: 'text-2xl font-bold text-brand-black mb-4',
  searchContainer: 'flex gap-4 items-center',
  searchInput:
    'flex-1 px-4 py-2 border border-brand-light-gray rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent',
  resetButton:
    'px-4 py-2 bg-brand-dark-gray text-brand-white rounded-lg hover:bg-brand-black transition-colors',
  searchResult: 'text-sm text-brand-dark-gray mt-2',
  dataContainer:
    'max-h-[70vh] overflow-y-auto border border-brand-light-gray rounded-lg',
  dataList: 'p-4 space-y-3',
  dataItem: (isHighlighted: boolean) =>
    `p-4 rounded-lg border transition-all duration-300 ${
      isHighlighted
        ? 'bg-brand-gold/20 border-brand-gold shadow-md'
        : 'bg-brand-light-gray/50 border-brand-light-gray hover:bg-brand-light-gray'
    }`,
  itemContent: 'space-y-2',
  itemHeader: 'flex items-center justify-between',
  itemTitle: 'flex items-center gap-2',
  fieldName: 'text-brand-blue font-semibold text-sm',
  fieldType:
    'text-xs text-brand-dark-gray px-2 py-1 bg-brand-light-gray rounded',
  matchIndicator: 'text-brand-gold text-sm font-medium',
  valueContainer: 'bg-brand-white p-3 rounded border border-brand-light-gray',
  valueText: 'text-sm text-brand-black break-all',
  emptyState: 'text-center py-8 text-brand-dark-gray',
} as const;
