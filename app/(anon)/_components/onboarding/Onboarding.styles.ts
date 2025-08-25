export const styles = {
  container: "flex flex-col h-screen text-black",
  
  header: "p-4 flex justify-end",
  
  skip: "text-sm hover:underline text-muted",
  
  viewport: "relative flex-1 overflow-hidden",
  
  track: "h-full flex transition-transform duration-300 ease-out",
  
  draggingTrack: "transition-none",
  
  slideWrap: "shrink-0 basis-full flex flex-col items-center text-center select-none relative p-8 p-4",
  
  content: "flex flex-col items-center justify-center flex-1 pt-16 pb-24",
  
  icon: "text-5xl mb-4",
  
  title: "text-base font-semibold",
  
  desc: "mt-2 text-sm text-muted",
  
  fixedDots: "w-full flex flex-col items-center justify-center absolute bottom-80 left-0 right-0",
  
  dots: "flex gap-2 items-center justify-center mb-3",
  
  dot: "h-2 w-2 rounded-full transition-all duration-200 ease-in-out",
  
  dotInactive: "bg-brand-light-gray",
  
  dotActive: "bg-brand",
  
  fixedStartBtn: "absolute bottom-72",
  
  startBtn: "text-base text-center text-brand",
  
  pwaContainer: "mt-6 w-full max-w-sm mx-auto",
  
  pwaContent: "flex flex-col items-center space-y-4",
  pwaIcon: "text-4xl mb-2",
  pwaTitle: "text-lg font-semibold text-brand",
  pwaDesc: "text-sm text-muted text-center leading-relaxed",
  pwaInstructions: "w-full space-y-3 mt-4",
  instruction: "flex items-center space-x-3 text-sm text-muted",
  step: "flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-semibold",
  
  pwaHeaderContainer: "ml-auto"
};
