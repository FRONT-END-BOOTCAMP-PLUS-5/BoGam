export const styles = {
  tooltipContainer: 'static inline-block',
  highlightedText: 'text-base text-brand-green font-bold underline cursor-pointer relative',
  tooltip: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-light-blue border border-brand-light-gray rounded-lg p-3 shadow-lg z-[9999] min-w-[12rem] max-w-[20rem] w-max break-words',
  tooltipVisible: 'opacity-100 visible',
  tooltipHidden: 'opacity-0 invisible pointer-events-none',
  tooltipArrow: 'absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-b-3 border-transparent border-b-brand-light-blue',
  tooltipArrowBorder: 'absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3.5 border-r-3.5 border-b-3.5 border-transparent border-b-brand-light-gray -z-10',
  tooltipText: 'text-black text-sm leading-relaxed text-center'
};
