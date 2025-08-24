/**
 * PdfViewer 컴포넌트 스타일
 */

export const styles = {
  // PDF 로딩 컨테이너
  pdfLoadingContainer: "flex justify-center items-center p-8 bg-brand-light-gray border border-brand-light-gray rounded-lg",
  
  // PDF 로딩 텍스트
  pdfLoadingText: "text-lg font-medium text-brand-dark-gray",
  
  // PDF 에러 컨테이너
  pdfErrorContainer: "flex justify-center items-center p-8 bg-brand-error-light border border-brand-error rounded-lg",
  
  // PDF 에러 텍스트
  pdfErrorText: "text-lg font-medium text-brand-error",
  
  // PDF 뷰어 컨테이너
  pdfViewerContainer: "space-y-4",
  
  // PDF 미리보기 컨테이너
  pdfPreviewContainer: "bg-brand-white border border-brand-light-gray rounded-lg p-4",
  
  // PDF 미리보기 제목
  pdfPreviewTitle: "text-lg font-semibold text-brand-black mb-4",
  
  // PDF iframe
  pdfIframe: "border border-brand-light-gray rounded",
  
  // PDF 다운로드 컨테이너
  pdfDownloadContainer: "flex justify-center",
  
  // PDF 다운로드 버튼
  pdfDownloadButton: "inline-flex items-center px-6 py-3 bg-brand text-brand-white font-medium rounded-lg hover:bg-brand transition-colors",
} as const;
