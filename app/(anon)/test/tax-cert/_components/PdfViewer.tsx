"use client";

import { useEffect, useState } from "react";
import styles from "../TaxCertResultDisplay.module.css";

interface PdfViewerProps {
  base64: string;
  fileName?: string;
}

export default function PdfViewer({ base64, fileName = "document.pdf" }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (base64) {
      try {
        setIsLoading(true);
        setError(null);

        // base64 → Blob 변환
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Blob → Object URL
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsLoading(false);

        // cleanup
        return () => URL.revokeObjectURL(url);
      } catch (err) {
        console.error('PDF 디코딩 실패:', err);
        setError('PDF 파일을 처리할 수 없습니다.');
        setIsLoading(false);
      }
    }
  }, [base64]);

  if (isLoading) {
    return (
      <div className={styles.pdfLoadingContainer}>
        <p className={styles.pdfLoadingText}>📄 PDF 로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pdfErrorContainer}>
        <p className={styles.pdfErrorText}>❌ {error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className={styles.pdfErrorContainer}>
        <p className={styles.pdfErrorText}>❌ PDF URL을 생성할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.pdfViewerContainer}>
      {/* PDF 미리보기 */}
      <div className={styles.pdfPreviewContainer}>
        <h5 className={styles.pdfPreviewTitle}>📄 PDF 미리보기</h5>
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          className={styles.pdfIframe}
          title="PDF 미리보기"
        />
      </div>

      {/* 다운로드 버튼 */}
      <div className={styles.pdfDownloadContainer}>
        <a
          href={pdfUrl}
          download={fileName}
          className={styles.pdfDownloadButton}
          title={`${fileName} 다운로드`}
        >
          💾 PDF 다운로드
        </a>
      </div>
    </div>
  );
}
