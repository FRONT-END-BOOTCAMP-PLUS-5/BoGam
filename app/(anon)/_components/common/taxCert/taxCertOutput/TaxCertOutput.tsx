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
import {
  useTaxCertRiskAssessment,
  TaxCertRiskAssessmentResult,
} from '@/hooks/useTaxCertRiskAssessment';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';

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

  const pathname = window.location.pathname;
  const stepUrlData = pathname.match(/\/steps\/(\d+)\/(\d+)/);
  const stepNumber = stepUrlData ? parseInt(stepUrlData[1]) : 1;
  const detail = stepUrlData ? parseInt(stepUrlData[2]) : 5;

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
      invalidateRiskDataCache();
    }
  });

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
  const taxCertData = displayResponse?.data?.taxCertJson;
  const hookRiskAssessment = useTaxCertRiskAssessment(
    taxCertData || null,
    selectedAddress?.nickname,
    checklistState
  );

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
    const newData = displayResponse?.data?.taxCertJson;
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
  }, [displayResponse?.data?.taxCertJson, invalidateRiskDataCache]);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      if (
        !loadLoading &&
        (!savedRiskData || dataChanged) &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        displayResponse?.data?.taxCertJson &&
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          // hook에서 계산된 위험도 검사 결과 사용
          setCalculatedRiskAssessment(
            hookRiskAssessment as TaxCertRiskAssessmentResult
          );

          // 초기 체크리스트 상태 설정
          if (hookRiskAssessment?.checklistItems) {
            const initialChecklistState: Record<string, boolean> = {};
            hookRiskAssessment.checklistItems.forEach((item) => {
              initialChecklistState[item.id] = item.checked;
            });
            setChecklistState(initialChecklistState);
          }

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

  // 데이터가 없을 때
  if (!hasData) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>응답 결과</h2>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>납세증명서 데이터가 없어요 !</p>
          <p className={styles.emptyText}>
            {(
              existsData as
                | { success: boolean; exists: boolean }
                | null
                | undefined
            )?.success &&
            !(
              existsData as
                | { success: boolean; exists: boolean }
                | null
                | undefined
            )?.exists
              ? '해당 주소에 대한 납세증명서 데이터가 없습니다. Input 탭에서 데이터를 조회해주세요.'
              : '혹시 주소를 선택하지 않으셨나요?'}
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

  // 변환된 위험도 검사 결과
  const convertedRiskAssessment = hookRiskAssessment
    ? convertToRiskAssessmentResult(hookRiskAssessment)
    : calculatedRiskAssessment
    ? convertToRiskAssessmentResult(calculatedRiskAssessment)
    : riskAssessment;

  return (
    <div>
      <div className={styles.buttonContainer}>
        <OriginalDocumentButton displayResponse={displayResponse} />
      </div>
      <RiskAssessmentDisplay
        riskAssessment={convertedRiskAssessment}
        displayResponse={displayResponse}
        checklistItems={hookRiskAssessment?.checklistItems}
        onChecklistItemChange={handleChecklistItemChange}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='taxCert'
        initialJsonData={savedRiskData?.jsonData}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />
    </div>
  );
};
