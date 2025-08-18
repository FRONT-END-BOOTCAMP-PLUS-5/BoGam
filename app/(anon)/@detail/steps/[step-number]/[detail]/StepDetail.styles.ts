export const styles = {
  // Modal Overlay
  modalOverlay:
    'fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fadeIn',

  // Modal Content
  modalContent:
    'bg-brand-light-blue w-full max-w-[480px] h-[calc(100vh-200px)] rounded-t-[20px] overflow-y-auto animate-slideUp mx-4',
  
  // Modal Content with Transform
  modalContentWithTransform: (translateY: number, isDragging: boolean) => ({
    transform: `translateY(${translateY}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  }),

  // Loading and Error States
  loadingContainer: 'flex items-center justify-center h-32',
  loadingText: 'text-brand-dark-gray',
  errorContainer: 'flex items-center justify-center h-32',
  errorText: 'text-brand-error',

  // Drag Handle
  dragHandle: 'flex justify-center py-2 cursor-grab active:cursor-grabbing',
  dragIndicator: 'w-8 h-[3px] bg-brand-dark-gray rounded-[2px]',

  // Divider
  divider: 'w-full h-[1px] bg-brand-dark-gray my-2 mx-auto',

  // Modal Header
  modalHeader: 'flex justify-end p-4 pt-2',
  closeButton:
    'p-2 rounded-full text-brand-dark-gray transition-colors hover:bg-brand-light-gray',

  // Main Content
  mainContent: 'bg-brand-light-blue p-6 min-h-[400px] relative',

  // Section Header
  sectionHeader: 'flex items-center justify-between mb-6 mt-4',
  detailTitle: 'text-lg font-bold text-brand-black m-0',
  safetyBadge:
    'flex items-center gap-1 bg-brand-green text-brand-white px-3 py-1.5 rounded-full text-xs font-semibold',

  // Expandable Section
  expandableSection: 'mt-4',
  expandableHeader:
    'flex items-center gap-2 w-full text-left p-3 transition-opacity hover:opacity-80',
  expandIcon: 'w-4 h-4 transition-transform',
  expandableTitle: 'text-base font-medium text-brand-black',

  // Details List
  detailsList: 'mt-4 pl-6',
  detailItem: 'flex mb-3 leading-relaxed',
  detailKey: 'font-medium text-brand-black min-w-[120px] flex-shrink-0',
  detailValue: 'text-brand-dark-gray ml-2',
} as const;
