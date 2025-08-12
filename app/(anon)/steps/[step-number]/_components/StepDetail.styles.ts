export const styles = {
  // Modal Overlay
  modalOverlay: "fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fadeIn",
  
  // Modal Content
  modalContent: "bg-[#DFE9F2] w-full max-w-[480px] max-h-[90vh] rounded-t-[20px] overflow-hidden animate-slideUp mx-4",
  
  // Drag Handle
  dragHandle: "flex justify-center py-2 cursor-grab active:cursor-grabbing",
  dragIndicator: "w-8 h-[3px] bg-gray-400 rounded-[2px]",
  
  // Modal Header
  modalHeader: "flex justify-end p-4 pt-2",
  closeButton: "p-2 rounded-full text-gray-600 transition-colors hover:bg-gray-100",
  
  // Main Content
  mainContent: "bg-[#DFE9F2] p-6 min-h-[400px] relative",
  
  // Section Header
  sectionHeader: "flex items-center justify-between mb-6 mt-4",
  detailTitle: "text-lg font-bold text-black m-0",
  safetyBadge: "flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold",
  
  // Expandable Section
  expandableSection: "mt-4",
  expandableHeader: "flex items-center gap-2 w-full text-left p-3 transition-opacity hover:opacity-80",
  expandIcon: "w-4 h-4 transition-transform",
  expandableTitle: "text-base font-medium text-black",
  
  // Details List
  detailsList: "mt-4 pl-6",
  detailItem: "flex mb-3 leading-relaxed",
  detailKey: "font-medium text-black min-w-[120px] flex-shrink-0",
  detailValue: "text-gray-700 ml-2"
} as const;
