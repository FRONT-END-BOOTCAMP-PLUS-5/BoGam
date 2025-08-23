export const stepsStyles = {
  container: "w-full min-h-screen bg-transparent",
  header: "sticky top-16 z-30 p-4",
  mainContent: "p-4",
  loadingOverlay: "fixed inset-0 bg-brand-white z-50 flex items-center justify-center",
  loadingContent: "text-center",
  loadingSpinner: "w-16 h-16 border-4 border-brand-light-gray border-t-brand rounded-full animate-spin mx-auto mb-4",
  loadingTitle: "text-xl font-semibold text-brand-black mb-2",
  loadingDescription: "text-brand-dark-gray mb-4",
  progressBarContainer: "w-64 bg-brand-light-gray rounded-full h-3 mx-auto mb-2",
  progressBar: "bg-brand h-3 rounded-full transition-all duration-300 ease-out",
  progressText: "text-sm text-brand-dark-gray"
} as const;
