export const styles = {
  container: "w-full bg-white overflow-hidden",
  header: "w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-brand-light-gray transition-colors duration-200",
  title: "text-sm font-medium text-brand-black text-left flex items-center",
  stageNumber: "font-bold text-brand-black",
  subtitle: "font-normal text-brand-black ml-1",
  numbers: "flex items-center space-x-4 text-xs text-brand-black",
  numberItem: "w-4 text-center",
  icon: "w-5 h-5 text-brand-dark-gray",
  iconOpen: "w-5 h-5 text-brand-gold",
  content: "bg-brand-light-gray/20 border-t border-brand-light-gray/20 overflow-hidden transition-all duration-300 ease-in-out",
  contentClosed: "max-h-0 py-0 px-0 opacity-0 border-t-0",
  contentOpen: "max-h-[1000px] py-4 px-4 opacity-100",
  bottomBorder: "border-b border-brand-light-gray"
} as const;
