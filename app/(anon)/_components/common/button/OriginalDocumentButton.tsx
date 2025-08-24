'use client';

import React, { useState } from 'react';
import Button from './Button';

interface OriginalDocumentButtonProps {
  pdfData: string;
}

export function OriginalDocumentButton({ pdfData }: OriginalDocumentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenOriginal = async () => {
    if (pdfData) {
      setIsLoading(true);
      try {
        const blob = new Blob(
          [Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0))],
          { type: 'application/pdf' }
        );
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (error) {
        console.error('PDF 열기 중 오류 발생:', error);
        alert('PDF 파일을 열 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!pdfData) {
    return null;
  }

  return (
    <Button
      onClick={handleOpenOriginal}
      disabled={isLoading}
      className="!mt-0"
    >
      {isLoading ? '열는 중...' : '원문보기'}
    </Button>
  );
};
