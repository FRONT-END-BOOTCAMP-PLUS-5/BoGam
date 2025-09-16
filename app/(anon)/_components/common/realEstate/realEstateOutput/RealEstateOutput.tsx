'use client';

import { useEffect, useRef, useState } from 'react';
import { RealEstateOutputProps } from '@/(anon)/_components/common/realEstate/types';
import { styles } from './RealEstateOutput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRealEstateOutput } from '@/hooks/useRealEstateOutput';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { RealEstateEntity } from '@be/domain/entities/RealEstate';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { parseStepUrl } from '@utils/stepUrlParser';

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

  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 1;

  // 전체 step-result 데이터 요청 (RealEstateIntro 데이터 포함)
  const { 
    data: stepResultData, 
    isLoading: loadLoading,
    refetch: invalidateRiskDataCache 
  } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber.toString(),
    detail: detail.toString(),
  });

  // stepResultData에서 jsonDetails 추출
  const getJsonDetails = () => {
    if (!stepResultData) return null;
    
    let stepResult = stepResultData;
    if (Array.isArray(stepResult)) {
      stepResult = stepResult[0];
    }
    
    if (stepResult && 'jsonDetails' in stepResult) {
      return stepResult.jsonDetails;
    }
    
    return null;
  };

  const jsonDetails = getJsonDetails();


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
      // 등기부등본 데이터가 있고, 위험도 검사가 실행되지 않았을 때만 실행
      if (
        !loadLoading &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        (displayResponse?.data?.data ||
          displayResponse?.data?.realEstateJson?.data) &&
        selectedAddress?.nickname &&
        hookRiskAssessment
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          console.log('🔄 새로운 등기부등본 데이터로 위험도 검사 시작');

          // hook에서 계산된 위험도 검사 결과 사용
          setCalculatedRiskAssessment(hookRiskAssessment);

          // 데이터 변경 플래그 리셋
          setDataChanged(false);
        } catch (error) {
          console.error('위험도 검사 실행 중 오류:', error);
          // 위험도 검사 실행 중 오류 발생 시 상태 리셋
          hasPerformedRiskAssessment.current = false;
          setIsPerformingRiskAssessment(false);
        } finally {
          setIsPerformingRiskAssessment(false);
        }
      }
    };

    performRiskAssessment();
  }, [
    loadLoading,
    jsonDetails,
    dataChanged,
    isPerformingRiskAssessment,
    hasData,
    displayResponse?.data?.data,
    displayResponse?.data?.realEstateJson?.data,
    selectedAddress,
    stepNumber,
    detail,
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

  // 원문 데이터가 모두 없을 때
  if (!hasData) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>응답 결과</h2>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>
            안전도를 검사할 등기부등본 데이터가 없어요!
          </p>
          <p className={styles.emptyText}>
            Input 탭에서 등기부등본을 조회하고 선택하시면 안전도 검사 결과를
            확인할 수 있습니다.
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
        initialJsonData={jsonDetails || {}}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />

      {/* PDF 표시 제거 - 항상 원문보기 버튼 방식으로 통일 */}
    </div>
  );
};
