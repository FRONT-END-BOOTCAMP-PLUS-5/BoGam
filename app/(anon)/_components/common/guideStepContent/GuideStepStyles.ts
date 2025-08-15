export const styles = {
  // 공통 컨테이너
  container: "space-y-3",
  
  // 들여쓰기 컨테이너
  indentedContainer: "space-y-3 pl-6",
  
  // Row 컴포넌트 (들여쓰기 포함)
  row: "flex items-center space-x-3 pl-6",
  content: "flex-1",
  
  // Text 컴포넌트
  text: "text-gray-700",
  
  // MultiLineText 컴포넌트
  multiLineText: "space-y-1",
  
  // Link 컴포넌트 (들여쓰기 포함)
  linkRow: "flex items-center space-x-2 underline cursor-pointer pl-6",
  linkText: "text-brand underline cursor-pointer"
} as const;
