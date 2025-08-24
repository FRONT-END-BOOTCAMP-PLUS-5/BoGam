export const styles = {
  // 필드 레이아웃
  field: "w-full",
  
  labelRow: "mb-2 flex items-center justify-between",
  
  label: "text-sm text-brand-dark-gray font-semibold",
  
  require: "text-brand-error ml-1",
  
  action: "text-sm text-brand",
  
  control: "relative",
  
  // 베이스 인풋
  inputBase: "w-full rounded-xl border px-3 py-3 text-[15px] bg-brand-white border-brand-light-gray placeholder:text-brand-light-gray",
  
  inputFocus: "shadow-[0_0_0_3px_var(--brand-shadow)] border-brand",
  
  inputError: "shadow-[0_0_0_3px_var(--brand-error)]",
  
  input: "relative",
  
  addonRight: "absolute top-1/2 -translate-y-1/2 right-2 px-3 py-1 text-xs rounded-md flex items-center justify-center text-brand",
  
  helper: "mt-2 text-xs text-brand-dark-gray",
  
  error: "mt-2 text-xs text-brand-error",
  
  // 비밀번호 보기 토글
  eyeBtn: "absolute inset-y-0 right-2 flex items-center text-brand-dark-gray w-10",
  
  // OTP
  otpRow: "mt-2 flex items-center gap-2",
  
  otpBox: "w-12 h-12 text-center rounded-xl border text-lg border-brand-light-gray focus:shadow-[0_0_0_3px_var(--brand-shadow)] focus:border-brand",

  otpEyeBtn: "flex items-center text-brand-dark-gray w-10 ml-2",
  
  // 그리드 레이아웃(선택)
  formRow: "grid grid-cols-1 gap-6 w-[90%] mx-auto"
};
