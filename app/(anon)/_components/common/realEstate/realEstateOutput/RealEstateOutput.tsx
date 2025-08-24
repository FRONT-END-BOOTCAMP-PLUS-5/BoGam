'use client';

import { useEffect, useRef, useState } from 'react';
import { RealEstateOutputProps } from '@/(anon)/_components/common/realEstate/types';
import { PdfViewer } from '@/(anon)/_components/common/pdfViewer/PdfViewer';
import { styles } from './RealEstateOutput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRealEstateOutput } from '@/hooks/useRealEstateOutput';
import { useRiskAssessmentLoad } from '@/hooks/useRiskAssessmentLoad';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { RealEstateEntity } from '@be/domain/entities/RealEstate';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';

export const RealEstateOutput = ({
  response,
  loading,
  existsData,
}: RealEstateOutputProps) => {
  const { selectedAddress } = useUserAddressStore();
  const {
    displayResponse,
    riskAssessment,
    loading: totalLoading,
    hasData,
  } = useRealEstateOutput({ response, loading, existsData });

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = pathname.match(/\/steps\/(\d+)\/(\d+)/);
  const stepNumber = stepUrlData ? parseInt(stepUrlData[1]) : 1;
  const detail = stepUrlData ? parseInt(stepUrlData[2]) : 1;

  // 저장된 위험도 검사 결과 로드
  const {
    data: savedRiskData,
    isLoading: loadLoading,
    invalidateCache: invalidateRiskDataCache,
  } = useRiskAssessmentLoad({
    stepNumber,
    detail,
    userAddressNickname: selectedAddress?.nickname || '',
  });

  // 위험도 검사 저장 훅
  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    if (data.success) {
      invalidateRiskDataCache();
    }
  });

  // 위험도 검사 실행 상태 관리
  const [isPerformingRiskAssessment, setIsPerformingRiskAssessment] =
    useState(false);
  const [calculatedRiskAssessment, setCalculatedRiskAssessment] =
    useState<RiskAssessmentResult | null>(null);

  // 위험도 검사 실행 여부를 추적하는 ref
  const hasPerformedRiskAssessment = useRef(false);

  // 새로운 데이터가 로드되었는지 추적하는 ref
  const lastDataHash = useRef<string>('');

  // 새로운 데이터가 로드되었는지 추적하는 state
  const [dataChanged, setDataChanged] = useState(false);

  // 위험도 검사 hook 사용
  const realEstateData =
    displayResponse?.data?.data || displayResponse?.data?.realEstateJson?.data;
  const hookRiskAssessment = useRiskAssessment(
    stepNumber,
    realEstateData as RealEstateEntity,
    null
  );

  // 새로운 데이터가 로드되었을 때 기존 위험도 검사 데이터 무효화
  useEffect(() => {
    const newData = displayResponse?.data?.data;
    const oldData = displayResponse?.data?.realEstateJson?.data;
    const currentData = newData || oldData;

    if (currentData) {
      const currentDataHash = JSON.stringify(currentData);

      if (
        lastDataHash.current !== '' &&
        lastDataHash.current !== currentDataHash
      ) {
        invalidateRiskDataCache();
        hasPerformedRiskAssessment.current = false;
        setDataChanged(true);
        setCalculatedRiskAssessment(null);
      }

      lastDataHash.current = currentDataHash;
    }
  }, [
    displayResponse?.data?.data,
    displayResponse?.data?.realEstateJson?.data,
    invalidateRiskDataCache,
  ]);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      if (
        !loadLoading &&
        (!savedRiskData || dataChanged) &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        (displayResponse?.data?.data ||
          displayResponse?.data?.realEstateJson?.data) &&
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          // hook에서 계산된 위험도 검사 결과 사용
          setCalculatedRiskAssessment(hookRiskAssessment);

          // 데이터 변경 플래그 리셋
          setDataChanged(false);
        } catch (error) {
          // 위험도 검사 실행 중 오류 발생
        } finally {
          setIsPerformingRiskAssessment(false);
        }
      }
    };

    performRiskAssessment();
  }, [
    loadLoading,
    savedRiskData,
    dataChanged,
    isPerformingRiskAssessment,
    hasData,
    displayResponse,
    selectedAddress,
    stepNumber,
    detail,
    saveRiskAssessmentMutation,
    invalidateRiskDataCache,
    hookRiskAssessment,
  ]);

  // 로딩 중일 때 (새로운 데이터 로딩 또는 위험도 검사 실행 중)
  if (totalLoading || isPerformingRiskAssessment || dataChanged) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
          <LoadingOverlay
            isVisible={true}
            title={
              dataChanged
                ? '새로운 등기부등본 데이터로 위험도 검사를 진행하는 중이에요!'
                : '등기부등본 데이터를 불러오는 중이에요!'
            }
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
        riskAssessment={
          hookRiskAssessment || calculatedRiskAssessment || riskAssessment
        }
        displayResponse={displayResponse}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='realEstate'
        initialJsonData={savedRiskData?.jsonData}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />

      {/* PDF 표시 제거 - 항상 원문보기 버튼 방식으로 통일 */}
    </div>
  );
};
