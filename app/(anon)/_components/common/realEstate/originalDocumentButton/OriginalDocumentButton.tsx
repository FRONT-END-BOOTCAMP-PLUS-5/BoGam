'use client';

import React, { useState } from 'react';
import { RealEstateData } from '@/(anon)/_components/common/realEstate/types';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import { styles } from './OriginalDocumentButton.styles';

interface OriginalDocumentButtonProps {
  displayResponse: ApiResponse | null;
}

export const OriginalDocumentButton: React.FC<OriginalDocumentButtonProps> = ({
  displayResponse,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenOriginal = async () => {
    const data = displayResponse?.data?.realEstateJson?.data;
    if (
      data &&
      typeof data === 'object' &&
      'resOriGinalData' in data &&
      typeof (data as RealEstateData).resOriGinalData === 'string'
    ) {
      setIsLoading(true);
      try {
        const pdfData = (data as RealEstateData).resOriGinalData!;
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

  const data = displayResponse?.data?.realEstateJson?.data;
  const hasOriginalData =
    data &&
    typeof data === 'object' &&
    'resOriGinalData' in data &&
    typeof (data as RealEstateData).resOriGinalData === 'string' &&
    (data as RealEstateData).resOriGinalData;

  if (!hasOriginalData) {
    return null;
  }

  return (
    <button
      onClick={handleOpenOriginal}
      disabled={isLoading}
      className={styles.button}
    >
      {isLoading ? '열는 중...' : '원문보기'}
    </button>
  );
};
