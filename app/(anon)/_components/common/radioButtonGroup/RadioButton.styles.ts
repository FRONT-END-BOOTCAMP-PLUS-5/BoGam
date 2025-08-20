export const styles = {
  // 라디오 버튼 컨테이너
  radioContainer: "flex items-center justify-center cursor-pointer",
  
  // 라디오 버튼 입력
  radioInput: "sr-only",
  
  // 라디오 버튼 커스텀 디자인
  radioButton: "w-5 h-5 rounded-full border-2 transition-all duration-200",
  
  // 라디오 버튼 상태별 스타일
  unchecked: "border-brand-light-gray bg-brand-white",
  checked: "border-brand bg-brand",
  
  // 체크 표시
  checkmark: "w-2 h-2 rounded-full bg-brand-white mx-auto mt-1",
  
  // 라벨 텍스트 (숨김)
  radioLabel: "sr-only",
  
  // 비활성화 상태
  disabled: "opacity-50 cursor-not-allowed",
  disabledLabel: "text-brand-light-gray"
} as const;
