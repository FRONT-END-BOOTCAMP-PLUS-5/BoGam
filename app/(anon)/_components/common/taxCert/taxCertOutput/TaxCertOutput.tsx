'use client';

import { useEffect, useRef, useState } from 'react';
import { TaxCertOutputProps } from '@/(anon)/_components/common/taxCert/types';
import { PdfViewer } from '@/(anon)/_components/common/pdfViewer/PdfViewer';
import { styles } from './TaxCertOutput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { OriginalDocumentButton } from '@/(anon)/_components/common/realEstate/originalDocumentButton/OriginalDocumentButton';
import { useTaxCertOutput } from '@/hooks/useTaxCertOutput';
import { useRiskAssessmentLoad } from '@/hooks/useRiskAssessmentLoad';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { parseStepUrl } from '@utils/stepUrlParser';
import {
  useTaxCertRiskAssessment,
  TaxCertRiskAssessmentResult,
} from '@/hooks/useTaxCertRiskAssessment';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { TaxCertData } from '@/(anon)/_components/common/taxCert/types';

export const TaxCertOutput = ({
  response,
  loading,
  existsData,
}: TaxCertOutputProps) => {
  const { selectedAddress } = useUserAddressStore();

  const {
    displayResponse,
    riskAssessment,
    loading: totalLoading,
    hasData,
  } = useTaxCertOutput({ response, loading, existsData });

  console.log('displayResponse', displayResponse);
  console.log('displayResponse.data', displayResponse?.data);
  console.log('displayResponse.data.data', displayResponse?.data?.data);
  console.log(
    'displayResponse.data.data.resOriGinalData1',
    (displayResponse?.data as { data?: { resOriGinalData1?: string } })?.data
      ?.resOriGinalData1
  );

  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 5;

  // 전체 step-result 데이터 요청 (TaxCertIntro 데이터 포함)
  const { data: stepResultData } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber.toString(),
    detail: detail.toString(),
  });

  const {
    data: savedRiskData,
    isLoading: loadLoading,
    invalidateCache: invalidateRiskDataCache,
  } = useRiskAssessmentLoad({
    stepNumber,
    detail,
    userAddressNickname: selectedAddress?.nickname || '',
  });

  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    if (data.success) {
      console.log('saveRiskAssessmentMutation', data);
      invalidateRiskDataCache();
    }
  });

  console.log('savedRiskData', savedRiskData);
  console.log('savedRiskData?.jsonData', savedRiskData?.jsonData);
  console.log('savedRiskData?.domain', savedRiskData?.domain);

  const [isPerformingRiskAssessment, setIsPerformingRiskAssessment] =
    useState(false);
  const [calculatedRiskAssessment, setCalculatedRiskAssessment] =
    useState<TaxCertRiskAssessmentResult | null>(null);

  const hasPerformedRiskAssessment = useRef(false);
  const lastDataHash = useRef<string>('');
  const [dataChanged, setDataChanged] = useState(false);

  // 체크리스트 상태를 별도로 관리
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );

  // 위험도 검사 hook 사용
  const taxCertData = displayResponse?.data as TaxCertData | null;
  const hookRiskAssessment = useTaxCertRiskAssessment(
    taxCertData,
    selectedAddress?.nickname,
    checklistState
  );

  console.log('hookRiskAssessment', hookRiskAssessment);

  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    // 체크리스트 상태 업데이트
    setChecklistState((prev) => {
      const newState = {
        ...prev,
        [itemId]: checked,
      };
      return newState;
    });
  };

  // 새로운 데이터가 로드되었을 때 기존 위험도 검사 데이터 무효화
  useEffect(() => {
    const newData = displayResponse?.data;
    const currentData = newData;

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
  }, [displayResponse?.data, invalidateRiskDataCache]);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      // taxCert 도메인의 step-result 데이터가 있으면 위험도 검사 실행하지 않음
      if (
        savedRiskData?.jsonData &&
        Object.keys(savedRiskData.jsonData).length > 0 &&
        savedRiskData?.domain === 'taxCert'
      ) {
        console.log('✅ 저장된 위험도 검사 데이터가 있어서 자동 실행하지 않음');
        console.log('저장된 데이터:', savedRiskData.jsonData);
        return;
      }

      // 납세증명서 데이터가 있고, 위험도 검사가 실행되지 않았을 때만 실행
      if (
        !loadLoading &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        displayResponse?.data &&
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          console.log('🔄 새로운 납세증명서 데이터로 위험도 검사 시작');

          // hook에서 계산된 위험도 검사 결과 사용
          setCalculatedRiskAssessment(
            hookRiskAssessment as TaxCertRiskAssessmentResult
          );

          // 초기 체크리스트 상태 설정
          if (hookRiskAssessment?.checklistItems) {
            const initialChecklistState: Record<string, boolean> = {};
            console.log(
              'hookRiskAssessment.checklistItems',
              hookRiskAssessment.checklistItems
            );
            hookRiskAssessment.checklistItems.forEach((item) => {
              initialChecklistState[item.id] = item.checked;
            });
            setChecklistState(initialChecklistState);
          }

          console.log('initialChecklistState', checklistState);
          console.log('hookRiskAssessment', hookRiskAssessment);

          setDataChanged(false);
        } catch (error) {
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
    savedRiskData,
    dataChanged,
    isPerformingRiskAssessment,
    hasData,
    displayResponse?.data,
    selectedAddress,
    stepNumber,
    detail,
    saveRiskAssessmentMutation,
    invalidateRiskDataCache,
    // hookRiskAssessment 제거 - 무한 루프 방지
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
                ? '새로운 납세증명서 데이터로 위험도 검사를 진행하는 중이에요!'
                : '납세증명서 데이터를 불러오는 중이에요!'
            }
            currentStep={1}
            totalSteps={3}
          />
        </div>
      </div>
    );
  }

  // step-result 데이터와 원문 데이터가 모두 없을 때
  if (!savedRiskData?.jsonData && !hasData) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>응답 결과</h2>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>
            안전도를 검사할 납세증명서 데이터가 없어요!
          </p>
          <p className={styles.emptyText}>
            Input 탭에서 납세증명서를 조회하고 선택하시면 안전도 검사 결과를
            확인할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // TaxCertRiskAssessmentResult를 RiskAssessmentResult로 변환
  const convertToRiskAssessmentResult = (
    taxCertResult: TaxCertRiskAssessmentResult
  ): RiskAssessmentResult => {
    return {
      stepNumber: taxCertResult.stepNumber,
      riskLevel: taxCertResult.riskLevel,
      riskFactors: taxCertResult.riskFactors,
      totalRiskScore: taxCertResult.totalRiskScore,
      recommendations: taxCertResult.recommendations,
      keywordChecks: taxCertResult.keywordChecks.map((check) => ({
        keyword: check.keyword,
        passed: check.passed,
        foundCount: check.foundCount,
        status: check.status, // 이제 status 속성이 있음
      })),
      totalKeywords: taxCertResult.totalKeywords,
      passedKeywords: taxCertResult.passedKeywords,
    };
  };

  // 전체 step-result 데이터에서 jsonDetails 추출 (TaxCertIntro 데이터 포함)
  const getInitialJsonData = () => {
    if (Array.isArray(stepResultData)) {
      return stepResultData[0]?.jsonDetails || {};
    } else if (stepResultData && 'jsonDetails' in stepResultData) {
      return stepResultData.jsonDetails;
    }
    return savedRiskData?.jsonData || {};
  };

  // 변환된 위험도 검사 결과
  const convertedRiskAssessment = hookRiskAssessment
    ? convertToRiskAssessmentResult(hookRiskAssessment)
    : calculatedRiskAssessment
    ? convertToRiskAssessmentResult(calculatedRiskAssessment)
    : riskAssessment;

  return (
    <div>
      <RiskAssessmentDisplay
        riskAssessment={convertedRiskAssessment}
        displayResponse={displayResponse}
        checklistItems={hookRiskAssessment?.checklistItems}
        onChecklistItemChange={handleChecklistItemChange}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='taxCert'
        initialJsonData={getInitialJsonData()}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />
    </div>
  );
};
