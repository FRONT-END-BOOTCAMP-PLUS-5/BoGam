/**
 * TaxCert 컴포넌트 스타일 (Common 스타일 포함)
 */

export const styles = {
  // TaxCert 전용 스타일
  // 메인 컨테이너
  container: "",
  
  // 폼 컨테이너
  formContainer: "bg-brand-white rounded-lg shadow-sm p-6 mb-6",
  
  // 폼 제목
  formTitle: "text-2xl font-bold text-brand-black mb-6",
  
  // 폼
  form: "flex flex-col space-y-6",
  
  // 폼 그리드
  formGrid: "grid grid-cols-1 gap-4",
  
  // 2열 폼 그리드
  formGridTwo: "grid grid-cols-1 gap-4 md:grid-cols-2",

  // Common 스타일
  // 공통 폼 필드
  formField: "flex flex-col",
  
  // 라벨
  label: "block text-sm font-medium text-brand-dark-gray mb-1",
  
  // 필수 라벨
  labelRequired: "block text-sm font-semibold text-brand-error mb-1",
  
  // 입력 필드
  input: "w-full px-3 py-2 border border-brand-light-gray rounded-md text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand",
  
  // 필수 입력 필드
  inputRequired: "w-full px-3 py-2 border-2 border-brand-error rounded-md text-sm bg-brand-error-light transition-all focus:outline-none focus:border-brand-error focus:bg-brand-white focus:ring-0 focus:ring-brand-error",
  
  // 텍스트 영역
  textarea: "w-full px-3 py-2 border border-brand-light-gray rounded-md text-sm resize-y min-h-24 transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand",
  
  // 셀렉트 박스
  select: "w-full px-3 py-2 border border-brand-light-gray rounded-md text-sm bg-brand-white transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand",
  
  // 필수 셀렉트 박스
  selectRequired: "w-full px-3 py-2 border-2 border-brand-error rounded-md text-sm bg-brand-error-light transition-all focus:outline-none focus:border-brand-error focus:bg-brand-white focus:ring-0 focus:ring-brand-error",
  
  // 버튼 컨테이너
  buttonContainer: "flex justify-end gap-4",
  
  // 제출 버튼
  submitButton: "bg-brand text-brand-white px-6 py-2 rounded-md font-medium transition-all hover:bg-brand-90 disabled:opacity-50 disabled:cursor-not-allowed",
  
  // 에러 컨테이너
  errorContainer: "mt-4 p-4 bg-brand-error-light border border-brand-error rounded-md",
  
  // 에러 텍스트
  errorText: "text-brand-error",
  
  // 선택 없음 텍스트
  noSelectionText: "text-center text-brand-dark-gray italic p-4 bg-brand-light-gray border border-dashed border-brand-light-gray rounded-md my-4",
} as const;
