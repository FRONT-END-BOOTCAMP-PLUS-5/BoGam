export const styles = {
  container: "w-full space-y-6 bg-transparent",
  title: "text-lg font-semibold text-brand-black",
  sectionLabel: "text-base font-semibold text-brand-black mb-4",
  grid: "grid grid-cols-1 gap-6",
  bookItem: "relative",
  textBox: "absolute inset-y-0 -z-10 bg-brand-white backdrop-blur-sm rounded-lg p-4 shadow-lg pointer-events-none w-full",
  bookTitle: "text-sm text-brand-dark-gray",
  bookSubtitle: "text-base font-medium text-brand-black",
  bookDescription: "text-sm text-brand-dark-gray",
  divider: "h-px bg-brand-light-gray"
} as const;
