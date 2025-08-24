export const styles = {
  checklistSection: 'mt-6',
  checklistHeader: 'flex items-center justify-between mb-3',
  checklistTitle: 'font-semibold text-brand-black',
  checklistSummary: 'text-sm text-brand-dark-gray',
  checklistGrid: 'grid grid-cols-2 gap-3',
  checklistItem: 'bg-brand-white p-3 rounded-lg border',
  checklistItemChecked: 'border-brand-green/30 bg-brand-green/5',
  checklistItemUnchecked: 'border-brand-error/30 bg-brand-error/5',
  checklistItemHeader: 'flex flex-col gap-2 mb-2',
  checklistItemControls: 'flex items-center gap-4',
  radioLabel: 'flex items-center gap-2 cursor-pointer',
  radioInput:
    'w-4 h-4 text-brand-blue border-brand-gray-300 focus:ring-brand-blue',
  radioText: 'text-sm text-brand-black',
  checklistItemLabel: 'font-medium text-brand-black text-sm',
  checklistItemDescription: 'text-xs text-brand-dark-gray',
} as const;
