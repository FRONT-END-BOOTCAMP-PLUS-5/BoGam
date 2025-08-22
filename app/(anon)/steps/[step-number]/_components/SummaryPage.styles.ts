export const SummaryPageStyles = {
  generalPage: 'bg-[var(--brand)] w-full h-full flex items-start justify-start box-border relative',
  leftDiv: 'w-[50px] h-full flex flex-col bg-transparent border-none shadow-none flex-shrink-0',
  leftFirst: "flex-1 w-full h-[20%] bg-transparent border-r-[10px] border-r-[var(--brand-light-gray)] border-b-[3px] border-b-[var(--brand-light-gray)]",
  leftCenter: "flex-1 w-full h-[20%] bg-transparent border-t-[10px] border-t-[var(--brand-light-gray)] border-r-[10px] border-r-[var(--brand-light-gray)] border-b-[3px] border-b-[var(--brand-light-gray)]",
  leftLast: "flex-1 w-full h-[20%] bg-transparent border-t-[10px] border-t-[var(--brand-light-gray)] border-r-[10px] border-r-[var(--brand-light-gray)]",
  rightFirstOutsideBox: 'w-[87%] bg-white h-[5vh] rounded-lg ml-[6%] mt-[2vh]',
  rightFirstInsideBox: 'w-[95%] border-2 border-[var(--brand)] mx-auto mt-[2vh] rounded-lg h-[3.5vh] relative top-[0.6vh]',
  smallFont: 'font-bold text-[0.8em] flex items-center justify-center pt-[0.3vh]',
  whitePaper: 'w-[90%] bg-white ml-[5%] rounded-xl mt-[2vh] p-[2vh_4%] h-[60vh] min-h-[40vh]',
  topic: 'text-[0.8em] font-bold pb-[1vh] pt-[1vh] border-b border-gray-400 mb-[1.5vh]',
  introContent: 'text-[0.65em] pb-[1vh]',
  generalPageGreen: 'bg-[var(--brand-dark-green)] w-full h-full flex items-start justify-start box-border relative'
} as const;
