'use client';

import { useEffect, useRef, useState } from 'react';
import { useGetBrokerCopy } from '@/hooks/useBroker';
import { useBrokerRiskAssessment } from '@/hooks/useBrokerRiskAssessment';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRiskAssessmentLoad } from '@/hooks/useRiskAssessmentLoad';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { styles } from './BrokerOutput.styles';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

interface BrokerOutputProps {
  userAddressNickname: string;
  selectedBroker?: BrokerData;
}

export const BrokerOutput = ({
  userAddressNickname,
  selectedBroker,
}: BrokerOutputProps) => {
  const { selectedAddress } = useUserAddressStore();
  const brokerCopyQuery = useGetBrokerCopy(userAddressNickname || null);

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = pathname.match(/\/steps\/(\d+)\/(\d+)/);
  const stepNumber = stepUrlData ? parseInt(stepUrlData[1]) : 3;
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

  // 중개업자 안전도 검사 hook 사용 (selectedBroker 또는 저장된 broker 데이터 사용)
  const brokerData =
    selectedBroker ||
    (brokerCopyQuery.data?.data as { brokerData?: BrokerData })?.brokerData ||
    null;
  const brokerRiskAssessment = useBrokerRiskAssessment(brokerData);

  // BrokerRiskAssessmentResult를 RiskAssessmentResult로 변환하는 함수
  const convertToRiskAssessmentResult = (
    brokerResult: ReturnType<typeof useBrokerRiskAssessment>
  ): RiskAssessmentResult => {
    return {
      stepNumber: brokerResult.stepNumber,
      riskLevel: brokerResult.riskLevel,
      riskFactors: brokerResult.riskFactors,
      totalRiskScore: brokerResult.totalRiskScore,
      recommendations: brokerResult.recommendations,
      keywordChecks: brokerResult.keywordChecks.map((check) => ({
        keyword: check.keyword,
        passed: check.passed,
        foundCount: check.foundCount,
        status: check.status,
      })),
      totalKeywords: brokerResult.totalKeywords,
      passedKeywords: brokerResult.passedKeywords,
    };
  };

  // 변환된 위험도 검사 결과
  const riskAssessment = convertToRiskAssessmentResult(brokerRiskAssessment);

  // 체크리스트 항목들 추출 및 상태 관리
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );

  // 초기 체크리스트 상태 설정
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    brokerRiskAssessment.checklistItems.forEach((item) => {
      initialState[item.id] = item.checked;
    });
    setChecklistState(initialState);
  }, [brokerRiskAssessment.checklistItems]);

  // 체크리스트 항목 변경 핸들러
  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    setChecklistState((prev) => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  // 업데이트된 체크리스트 항목들
  const checklistItems = brokerRiskAssessment.checklistItems.map((item) => ({
    ...item,
    checked: checklistState[item.id] ?? item.checked,
  }));

  // 새로운 데이터가 로드되었을 때 기존 위험도 검사 데이터 무효화
  useEffect(() => {
    const currentData = selectedBroker;

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
  }, [selectedBroker, invalidateRiskDataCache]);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      // step-result 데이터가 있으면 위험도 검사 실행하지 않음
      if (savedRiskData?.jsonData) {
        return;
      }

      // step-result 데이터가 없고, 원문 데이터가 있을 때만 위험도 검사 실행
      if (
        !loadLoading &&
        !savedRiskData?.jsonData &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        brokerData && // brokerData가 있으면 (selectedBroker 또는 저장된 broker 데이터)
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          // hook에서 계산된 위험도 검사 결과 사용
          setCalculatedRiskAssessment(riskAssessment);

          // 데이터 변경 플래그 리셋
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
    brokerData,
    selectedAddress,
    stepNumber,
    detail,
    saveRiskAssessmentMutation,
    invalidateRiskDataCache,
    riskAssessment,
  ]);

  // 로딩 중일 때 (새로운 데이터 로딩 또는 위험도 검사 실행 중)
  if (brokerCopyQuery.isLoading || isPerformingRiskAssessment || dataChanged) {
    return (
      <div className={styles.outputSection}>
        <div className={styles.outputSection}>
          <h2 className={styles.outputTitle}>응답 결과</h2>
          <LoadingOverlay
            isVisible={true}
            title={
              dataChanged
                ? '새로운 중개업자 데이터로 위험도 검사를 진행하는 중이에요!'
                : '중개업자 데이터를 불러오는 중이에요!'
            }
            currentStep={1}
            totalSteps={3}
          />
        </div>
      </div>
    );
  }

  // step-result 데이터와 원문 데이터가 모두 없을 때
  if (!savedRiskData?.jsonData && !selectedBroker && !brokerData) {
    return (
      <div className={styles.outputSection}>
        <h2 className={styles.outputTitle}>응답 결과</h2>
        <div className={styles.emptyState}>
          <p>안전도를 검사할 중개업자 데이터가 없어요!</p>
          <p className='text-sm text-brand-dark-gray mt-2'>
            Input 탭에서 중개업자를 조회하고 선택하시면 안전도 검사 결과를
            확인할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 위험도 측정 결과 표시 */}
      <RiskAssessmentDisplay
        riskAssessment={calculatedRiskAssessment || riskAssessment}
        displayResponse={null}
        checklistItems={checklistItems}
        onChecklistItemChange={handleChecklistItemChange}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='broker'
        initialJsonData={savedRiskData?.jsonData}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />
    </div>
  );
};
