'use client';

import React, { useState } from 'react';
import { RealEstateData } from '@/(anon)/_components/common/realEstate/types';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import { styles } from './OriginalDocumentButton.styles';
import { TaxCertApiResponse } from '@libs/api_front/taxCert.api';
import { BrokerApiResponse } from '@be/domain/entities/Broker';

interface OriginalDocumentButtonProps {
  displayResponse: ApiResponse | TaxCertApiResponse | null;
}

export const OriginalDocumentButton: React.FC<OriginalDocumentButtonProps> = ({
  displayResponse,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenOriginal = async () => {
    // 기존 데이터 구조 (realEstateJson.data) 또는 새로운 데이터 구조 (data.data)에서 PDF 데이터 찾기
    const oldData =
      'realEstateJson' in (displayResponse?.data || {})
        ? (displayResponse?.data as { realEstateJson?: { data?: unknown } })
            ?.realEstateJson?.data
        : undefined;
    const newData = displayResponse?.data?.data;
    const taxCertData = (displayResponse?.data as any)?.taxCertJson?.data;
    const data = oldData || newData || taxCertData;

    if (
      data &&
      typeof data === 'object' &&
      ('resOriGinalData' in data || 'resOriGinalData1' in data) &&
      (typeof (data as RealEstateData).resOriGinalData === 'string' ||
        typeof (data as any).resOriGinalData1 === 'string')
    ) {
      setIsLoading(true);
      try {
        // resOriGinalData 또는 resOriGinalData1에서 PDF 데이터 가져오기
        const pdfData = (data as RealEstateData).resOriGinalData || (data as any).resOriGinalData1;
        if (pdfData) {
          const blob = new Blob(
            [Uint8Array.from(atob(pdfData), (c) => c.charCodeAt(0))],
            { type: 'application/pdf' }
          );
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      } catch (error) {
        console.error('PDF 열기 중 오류 발생:', error);
        alert('PDF 파일을 열 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 기존 데이터 구조 또는 새로운 데이터 구조에서 PDF 데이터 존재 여부 확인
  const oldData =
    'realEstateJson' in (displayResponse?.data || {})
      ? (displayResponse?.data as { realEstateJson?: { data?: unknown } })
          ?.realEstateJson?.data
      : undefined;
  const newData = displayResponse?.data?.data;
  const taxCertData = (displayResponse?.data as any)?.taxCertJson?.data;
  const data = oldData || newData || taxCertData;
  const hasOriginalData =
    data &&
    typeof data === 'object' &&
    ('resOriGinalData' in data || 'resOriGinalData1' in data) &&
    (typeof (data as RealEstateData).resOriGinalData === 'string' ||
      typeof (data as any).resOriGinalData1 === 'string') &&
    ((data as RealEstateData).resOriGinalData || (data as any).resOriGinalData1);

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
