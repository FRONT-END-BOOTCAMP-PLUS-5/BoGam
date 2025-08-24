'use client';

import React from 'react';
import { RealEstateOutputProps } from '@/(anon)/_components/common/realEstate/types';
import { PdfViewer } from '@/(anon)/_components/common/pdfViewer/PdfViewer';
import { styles } from '../realEstateInput/RealEstateInput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRealEstateOutput } from '@/hooks/useRealEstateOutput';

export const RealEstateOutput = ({
  response,
  loading,
  existsData,
}: RealEstateOutputProps) => {
  const {
    selectedAddress,
    currentStep,
    displayResponse,
    dbLoading,
    riskAssessment,
    loading: totalLoading,
    hasData,
  } = useRealEstateOutput({ response, loading, existsData });

  // displayResponse에서 data 추출 (직접 접근)
  const data = displayResponse?.data?.realEstateJson?.data || null;

  // 로딩 중일 때
  if (totalLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.formContainer}>
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
        <div className={styles.formContainer}>
          <div className="text-center py-12 text-brand-dark-gray">
            <p className="text-brand-dark-gray">등기부등본 데이터가 없어요 !</p>
            <p className="text-brand-dark-gray">
              {existsData?.success && !existsData.exists
                ? '해당 주소에 대한 등기부등본 데이터가 없습니다. 입력 탭에서 데이터를 조회해주세요.'
                : '혹시 주소를 선택하지 않으셨나요?'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  console.log(data);
  return (
    <div className={styles.container}>
      {/* 위험도 측정 결과 표시 */}
      <RiskAssessmentDisplay
        riskAssessment={riskAssessment}
        displayResponse={displayResponse}
      />

      {data &&
      typeof data === 'object' &&
      'resOriGinalData' in data &&
      typeof data.resOriGinalData === 'string' ? (
        <div className="mb-6">
          <h3 className="font-semibold text-brand-black mb-3">등기부등본 PDF</h3>
          <PdfViewer
            base64={data.resOriGinalData}
            fileName='등기부등본.pdf'
          />
        </div>
      ) : null}
    </div>
  );
};
