'use client';

import React from 'react';
import { RealEstateOutputProps } from '@/(anon)/_components/common/realEstate/types';
import { PdfViewer } from '@/(anon)/_components/common/pdfViewer/PdfViewer';
import { styles } from './RealEstateOutput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRealEstateOutput } from '@/hooks/useRealEstateOutput';

export const RealEstateOutput = ({
  response,
  loading,
  existsData,
}: RealEstateOutputProps) => {
  const {
    displayResponse,
    riskAssessment,
    loading: totalLoading,
    hasData,
  } = useRealEstateOutput({ response, loading, existsData });

  // 로딩 중일 때
  if (totalLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
          <LoadingOverlay
            isVisible={true}
            title='등기부등본 데이터를 불러오는 중이에요!'
            currentStep={1}
            totalSteps={3}
          />
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!hasData) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>응답 결과</h2>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>등기부등본 데이터가 없어요 !</p>
          <p className={styles.emptyText}>
            {existsData?.success && !existsData.exists
              ? '해당 주소에 대한 등기부등본 데이터가 없습니다. Input 탭에서 데이터를 조회해주세요.'
              : '혹시 주소를 선택하지 않으셨나요?'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 위험도 측정 결과 표시 */}
      <RiskAssessmentDisplay
        riskAssessment={riskAssessment}
        displayResponse={displayResponse}
      />

      {displayResponse?.data?.data &&
      typeof displayResponse.data.data === 'object' &&
      'resOriGinalData' in displayResponse.data.data &&
      typeof (displayResponse.data.data as Record<string, unknown>)
        .resOriGinalData === 'string' ? (
        <div className={styles.pdfSection}>
          <h3 className={styles.pdfTitle}>등기부등본 PDF</h3>
          <PdfViewer
            base64={
              (displayResponse.data.data as Record<string, unknown>)
                .resOriGinalData as string
            }
            fileName='등기부등본.pdf'
          />
        </div>
      ) : null}
    </div>
  );
};
