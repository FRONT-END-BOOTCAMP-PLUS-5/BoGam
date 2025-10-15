'use client';

import { useEffect, useRef, useState } from 'react';
import { useGetBrokerCopy } from '@/hooks/useBroker';
import { useBrokerRiskAssessment } from '@/hooks/useBrokerRiskAssessment';
import { RiskAssessmentDisplay } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { styles } from './BrokerOutput.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { parseStepUrl } from '@utils/stepUrlParser';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

interface BrokerOutputProps {
  selectedBroker?: BrokerData;
}

export const BrokerOutput = ({
  selectedBroker,
}: BrokerOutputProps) => {
  const { selectedAddress } = useUserAddressStore();

  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 3;
  const detail = stepUrlData?.detail || 1;

  // 전체 step-result 데이터 요청 (BrokerIntro 데이터 포함)
  const {
    data: stepResultData,
    isLoading: loadLoading,
    refetch: invalidateRiskDataCache,
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

  // DB에서 broker 데이터 조회 (selectedBroker가 없을 때만)

  const brokerCopyQuery = useGetBrokerCopy(
    selectedBroker ? null : selectedAddress?.nickname || null
  );
  // 초기 렌더링 시 캐시 무효화 (새로운 데이터가 있을 때)
  useEffect(() => {
    if (selectedAddress?.nickname) {
      console.log('🔄 초기 렌더링 시 캐시 무효화 실행');
      invalidateRiskDataCache(); // stepResult 캐시 무효화
    }
  }, [selectedBroker, selectedAddress?.nickname, invalidateRiskDataCache]);

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
  console.log('brokerData', brokerData);
  console.log('brokerRiskAssessment', brokerRiskAssessment);

  // mappedRiskAssessment를 state로 관리
  const [mappedRiskAssessment, setMappedRiskAssessment] = useState<ReturnType<
    typeof useBrokerRiskAssessment
  > | null>(null);

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
  const [, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );

  // hookRiskAssessment가 있고 mappedRiskAssessment가 없을 때 초기 설정
  useEffect(() => {
    console.log('mappedRiskAssessment', mappedRiskAssessment);
    console.log('jsonDetails', jsonDetails);
    console.log('brokerRiskAssessment', brokerRiskAssessment);
    if (brokerRiskAssessment && !mappedRiskAssessment) {
      let initialMappedRiskAssessment = brokerRiskAssessment;

      // selectedBroker가 null이 아니면 (새로운 데이터) brokerRiskAssessment를 그대로 사용
      // selectedBroker가 null이면 (기존 데이터) DB에서 저장된 값이 있으면 체크 상태를 매핑
      if (!selectedBroker && jsonDetails) {
        initialMappedRiskAssessment = {
          ...brokerRiskAssessment,
          checklistItems: brokerRiskAssessment.checklistItems.map((item) => {
            const savedValue = jsonDetails[item.id];
            const checked =
              savedValue === 'match'
                ? true
                : savedValue === 'mismatch'
                ? false
                : item.checked;
            return {
              ...item,
              checked,
            };
          }),
        };
      }
      console.log('initialMappedRiskAssessment', initialMappedRiskAssessment);
      setMappedRiskAssessment(initialMappedRiskAssessment);
    }
  }, [brokerRiskAssessment, jsonDetails, mappedRiskAssessment, selectedBroker]);

  // 체크리스트 항목 변경 핸들러
  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    // 체크리스트 상태 업데이트
    console.log('itemId', itemId);
    console.log('checked', checked);
    setChecklistState((prev) => {
      const newState = {
        ...prev,
        [itemId]: checked,
      };
      return newState;
    });

    // mappedRiskAssessment의 checklistItems 업데이트
    setMappedRiskAssessment((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        checklistItems: prev.checklistItems.map((item) =>
          item.id === itemId ? { ...item, checked } : item
        ),
      };
    });
  };

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
      // 중개업자 데이터가 있고, 위험도 검사가 실행되지 않았을 때만 실행
      if (
        !loadLoading &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        brokerData &&
        selectedAddress?.nickname &&
        brokerRiskAssessment
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          console.log('🔄 새로운 중개업자 데이터로 위험도 검사 시작');

          // hook에서 계산된 위험도 검사 결과를 기반으로 mappedRiskAssessment 설정
          let initialMappedRiskAssessment = brokerRiskAssessment;

          // selectedBroker가 null이 아니면 (새로운 데이터) brokerRiskAssessment를 그대로 사용
          // selectedBroker가 null이면 (기존 데이터) DB에서 저장된 값이 있으면 체크 상태를 매핑
          if (!selectedBroker && jsonDetails && brokerRiskAssessment) {
            initialMappedRiskAssessment = {
              ...brokerRiskAssessment,
              checklistItems: brokerRiskAssessment.checklistItems.map(
                (item) => {
                  const savedValue = jsonDetails[item.id];
                  const checked =
                    savedValue === 'match'
                      ? true
                      : savedValue === 'mismatch'
                      ? false
                      : item.checked;
                  return {
                    ...item,
                    checked,
                  };
                }
              ),
            };
          }

          setMappedRiskAssessment(initialMappedRiskAssessment);
          setCalculatedRiskAssessment(
            convertToRiskAssessmentResult(initialMappedRiskAssessment)
          );

          // 초기 체크리스트 상태 설정
          if (initialMappedRiskAssessment?.checklistItems) {
            const initialChecklistState: Record<string, boolean> = {};
            initialMappedRiskAssessment.checklistItems.forEach((item) => {
              initialChecklistState[item.id] = item.checked;
            });
            setChecklistState(initialChecklistState);
          }

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
    brokerData,
    selectedAddress,
    stepNumber,
    detail,
    invalidateRiskDataCache,
    brokerRiskAssessment,
    selectedBroker,
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
            variant="inline"
          />
        </div>
      </div>
    );
  }

  // 원문 데이터가 모두 없을 때
  if (!selectedBroker && !brokerData) {
    return (
      <div className={styles.outputSection}>
        <h2 className={styles.outputTitle}>응답 결과</h2>
        <div className={styles.emptyState}>
          <p>안전도를 검사할 중개업자 데이터가 없어요!</p>
          <p className='text-sm text-brand-dark-gray mt-2'>
            입력 탭에서 중개업자를 조회하고 선택하시면 안전도 검사 결과를
            확인할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  // 변환된 위험도 검사 결과
  const convertedRiskAssessment = mappedRiskAssessment
    ? convertToRiskAssessmentResult(mappedRiskAssessment)
    : calculatedRiskAssessment
    ? calculatedRiskAssessment
    : riskAssessment;

  return (
    <div>
      {/* 위험도 측정 결과 표시 */}
      <RiskAssessmentDisplay
        riskAssessment={convertedRiskAssessment}
        displayResponse={null}
        checklistItems={
          mappedRiskAssessment?.checklistItems ||
          brokerRiskAssessment?.checklistItems
        }
        onChecklistItemChange={handleChecklistItemChange}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='broker'
        initialJsonData={jsonDetails || {}}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />
    </div>
  );
};
