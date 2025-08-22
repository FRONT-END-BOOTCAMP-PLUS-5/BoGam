'use client';

import React, { useEffect, useState } from 'react';
import { styles } from './PdfViewer.styles';

interface RealEstatePdfViewerProps {
  base64: string;
  fileName?: string;
}

export function PdfViewer({
  base64,
  fileName = '등기부등본.pdf',
}: RealEstatePdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (base64 && base64.trim() !== '') {
      try {
        setIsLoading(true);
        setError(null);

        // base64 → Blob 변환
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Blob → Object URL
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        setIsLoading(false);
      } catch (err) {
        console.error('PDF 변환 오류:', err);
        setError('PDF 데이터를 처리하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }

      // cleanup
      return () => {
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    } else {
      setIsLoading(false);
      setError('PDF 데이터가 없습니다.');
    }
  }, [base64]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>PDF를 로딩하는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
        <p className='text-gray-600 text-sm'>PDF 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* PDF 미리보기 */}
      <div className='border border-gray-200 rounded-lg overflow-hidden'>
        <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
          <h4 className='font-medium text-gray-800'>PDF 미리보기</h4>
        </div>
        <iframe
          src={pdfUrl}
          width='100%'
          height='600px'
          style={{ border: 'none' }}
          title='등기부등본 PDF'
        />
      </div>

      {/* 다운로드 버튼 */}
      <div className='flex justify-center'>
        <a
          href={pdfUrl}
          download={fileName}
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          PDF 다운로드
        </a>
      </div>
    </div>
  );
}
