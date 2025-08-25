export const styles = {
  // 베이스 인풋 (Forms.styles와 동일)
  inputBase: "w-full rounded-xl px-3 py-3 text-[15px] border border-brand-light-gray placeholder:text-brand-light-gray",
  
  inputFocus: "shadow-[0_0_0_3px_var(--brand-shadow)]",
  
  inputError: "shadow-[0_0_0_3px_var(--brand-error)]",
  
  input: "relative rounded-xl",
  
  // 상태별 input 스타일들
  inputDefault: "relative rounded-xl border border-brand-light-gray",
  
  inputFocused: "relative rounded-xl border border-brand",
  
  inputErrorState: "relative rounded-xl border border-brand-error",
  
  // 드롭다운 전용 스타일
  dropdownButton: "cursor-pointer pr-12",
  
  // 화살표 아이콘 스타일
  chevronIcon: "absolute top-1/2 -translate-y-1/2 right-3 text-brand-dark-gray transition-transform duration-200",
  
  // 드롭다운 메뉴 컨테이너
  dropdownMenu: "absolute z-50 w-full mt-1 bg-brand-white border border-brand-light-gray rounded-xl shadow-lg max-h-60 overflow-hidden",
  
  // 드롭다운 옵션 목록
  optionsList: "max-h-48 overflow-y-auto",
  
  // 드롭다운 옵션 버튼
  optionButton: "w-full px-3 py-3 text-left cursor-pointer transition-colors duration-150 hover:bg-brand-light-gray focus:outline-none focus:bg-brand-light-gray",
  
  // 선택된 옵션 스타일 (폼 인풋과 일관성 유지)
  selectedOption: "bg-brand text-brand-white font-medium",
  
  // 기본 옵션 텍스트 스타일
  defaultOptionText: "text-brand-black",
  
  // 상태별 완전한 CSS 클래스들
  buttonBase: "w-full px-3 py-3 text-[15px] cursor-pointer pr-12",
  
  buttonFocus: "w-full px-3 py-3 text-[15px] cursor-pointer pr-12",
  
  buttonError: "w-full px-3 py-3 text-[15px] cursor-pointer pr-12",
  
  chevronOpen: "absolute top-1/2 -translate-y-1/2 right-3 text-brand-dark-gray transition-transform duration-200 rotate-180",
  
  chevronClosed: "absolute top-1/2 -translate-y-1/2 right-3 text-brand-dark-gray transition-transform duration-200",
  
  optionSelected: "w-full px-3 py-3 text-left cursor-pointer transition-colors duration-150 bg-brand-light-blue font-medium",
  
  optionDefault: "w-full px-3 py-3 text-left cursor-pointer transition-colors duration-150 hover:bg-brand-light-blue focus:outline-none focus:bg-brand-light-blue text-brand-black",
}; 