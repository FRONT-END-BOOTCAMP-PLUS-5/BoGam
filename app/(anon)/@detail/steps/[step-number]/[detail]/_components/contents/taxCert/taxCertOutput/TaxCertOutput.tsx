'use client';

import { useEffect, useRef, useState } from 'react';
import { TaxCertOutputProps } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/types';
import { styles } from './TaxCertOutput.styles';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { RiskAssessmentDisplay } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useTaxCertOutput } from '@/hooks/useTaxCertOutput';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { parseStepUrl } from '@utils/stepUrlParser';
import {
  useTaxCertRiskAssessment,
  TaxCertRiskAssessmentResult,
} from '@/hooks/useTaxCertRiskAssessment';
import { RiskAssessmentResult } from '@/hooks/useRiskAssessment';
import { TaxCertData } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/types';

export const TaxCertOutput = ({
  response,
  loading,
  existsData,
}: TaxCertOutputProps) => {
  const { selectedAddress } = useUserAddressStore();
  console.log('selectedAddress', selectedAddress);

  const {
    displayResponse,
    riskAssessment,
    loading: totalLoading,
    hasData,
    //refetchTaxCertCopy,
  } = useTaxCertOutput({ response, loading, existsData });

  console.log('response', response);
  console.log('displayResponse', displayResponse);

  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 5;

  // 전체 step-result 데이터 요청 (TaxCertIntro 데이터 포함)
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

  // 초기 렌더링 시 캐시 무효화 (새로운 데이터가 있을 때)
  // useEffect(() => {
  //   if (hasData && response?.data && selectedAddress?.nickname) {
  //     console.log('🔄 초기 렌더링 시 캐시 무효화 실행');
  //     refetchTaxCertCopy(); // taxCertCopy 캐시 무효화
  //     invalidateRiskDataCache(); // stepResult 캐시 무효화
  //   }
  // }, [hasData, response?.data, selectedAddress?.nickname, refetchTaxCertCopy, invalidateRiskDataCache]);

  //console.log('savedRiskData', savedRiskData);

  const [isPerformingRiskAssessment, setIsPerformingRiskAssessment] =
    useState(false);
  const [calculatedRiskAssessment, setCalculatedRiskAssessment] =
    useState<TaxCertRiskAssessmentResult | null>(null);

  const hasPerformedRiskAssessment = useRef(false);
  // const lastDataHash = useRef<string>('');
  // const [dataChanged, setDataChanged] = useState(false);

  // 체크리스트 상태를 별도로 관리
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );

  // 위험도 검사 hook 사용
  const taxCertData = displayResponse?.data?.data as TaxCertData | null;
  const hookRiskAssessment = useTaxCertRiskAssessment(
    taxCertData,
    selectedAddress?.nickname,
    checklistState
  );

  // mappedRiskAssessment를 state로 관리
  const [mappedRiskAssessment, setMappedRiskAssessment] =
    useState<TaxCertRiskAssessmentResult | null>(null);

  // hookRiskAssessment가 변경될 때 mappedRiskAssessment 업데이트
  useEffect(() => {
    console.log('mappedRiskAssessment', mappedRiskAssessment);
    console.log('jsonDetails', jsonDetails);
    console.log('hookRiskAssessment', hookRiskAssessment);
    if (hookRiskAssessment) {
      // 기존 mappedRiskAssessment가 있으면 사용자가 수정한 체크 상태를 보존
      const existingChecklistState =
        mappedRiskAssessment?.checklistItems.reduce((acc, item) => {
          acc[item.id] = item.checked;
          return acc;
        }, {} as Record<string, boolean>) || {};

      let initialMappedRiskAssessment = hookRiskAssessment;

      // response가 null이 아니면 (새로운 데이터) hookRiskAssessment를 그대로 사용
      // response가 null이면 (기존 데이터) DB에서 저장된 값이 있으면 체크 상태를 매핑
      if (!response && jsonDetails) {
        initialMappedRiskAssessment = {
          ...hookRiskAssessment,
          checklistItems: hookRiskAssessment.checklistItems.map((item) => {
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

      // 사용자가 수정한 체크 상태가 있으면 적용
      if (Object.keys(existingChecklistState).length > 0) {
        initialMappedRiskAssessment = {
          ...initialMappedRiskAssessment,
          checklistItems: initialMappedRiskAssessment.checklistItems.map(
            (item) => ({
              ...item,
              checked: existingChecklistState[item.id] ?? item.checked,
            })
          ),
        };
      }

      console.log('initialMappedRiskAssessment', initialMappedRiskAssessment);
      setMappedRiskAssessment(initialMappedRiskAssessment);
    }
  }, [hookRiskAssessment, jsonDetails, response]);

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
  // useEffect(() => {
  //   const newData = displayResponse?.data;
  //   const currentData = newData;

  //   if (currentData) {
  //     const currentDataHash = JSON.stringify(currentData);

  //     if (
  //       lastDataHash.current !== '' &&
  //       lastDataHash.current !== currentDataHash
  //     ) {
  //       invalidateRiskDataCache();
  //       hasPerformedRiskAssessment.current = false;
  //       setDataChanged(true);
  //       setCalculatedRiskAssessment(null);
  //     }

  //     lastDataHash.current = currentDataHash;
  //   }
  // }, [displayResponse?.data, invalidateRiskDataCache]);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      // 납세증명서 데이터가 있고, 위험도 검사가 실행되지 않았을 때만 실행
      if (
        !loadLoading &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        response?.data &&
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          console.log('🔄 새로운 납세증명서 데이터로 위험도 검사 시작');

          // hook에서 계산된 위험도 검사 결과를 기반으로 mappedRiskAssessment 설정
          let initialMappedRiskAssessment = hookRiskAssessment;

          // response가 null이 아니면 (새로운 데이터) hookRiskAssessment를 그대로 사용
          // response가 null이면 (기존 데이터) DB에서 저장된 값이 있으면 체크 상태를 매핑
          if (!response && jsonDetails && hookRiskAssessment) {
            initialMappedRiskAssessment = {
              ...hookRiskAssessment,
              checklistItems: hookRiskAssessment.checklistItems.map((item) => {
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

          setMappedRiskAssessment(initialMappedRiskAssessment);
          setCalculatedRiskAssessment(
            initialMappedRiskAssessment as TaxCertRiskAssessmentResult
          );

          // 초기 체크리스트 상태 설정
          if (initialMappedRiskAssessment?.checklistItems) {
            const initialChecklistState: Record<string, boolean> = {};
            console.log(
              'initialMappedRiskAssessment.checklistItems',
              initialMappedRiskAssessment.checklistItems
            );
            initialMappedRiskAssessment.checklistItems.forEach((item) => {
              initialChecklistState[item.id] = item.checked;
            });
            setChecklistState(initialChecklistState);
          }

          // console.log('initialChecklistState', checklistState);
          // console.log('hookRiskAssessment', hookRiskAssessment);

          // setDataChanged(false);
        } catch {
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
    // dataChanged,
    isPerformingRiskAssessment,
    hasData,
    displayResponse?.data,
    selectedAddress,
    stepNumber,
    detail,
    invalidateRiskDataCache,
    // hookRiskAssessment 제거 - 무한 루프 방지
  ]);

  // 로딩 중일 때 (새로운 데이터 로딩 또는 위험도 검사 실행 중)
  if (totalLoading || isPerformingRiskAssessment) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
          <LoadingOverlay
            isVisible={true}
            title='납세증명서 데이터를 불러오는 중이에요!'
            currentStep={1}
            totalSteps={3}
            variant="inline"
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
            안전도를 검사할 납세증명서 데이터가 없어요!
          </p>
          <p className={styles.emptyText}>
            입력 탭에서 납세증명서를 조회하고 선택하시면 안전도 검사 결과를
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

  // 변환된 위험도 검사 결과
  const convertedRiskAssessment = mappedRiskAssessment
    ? convertToRiskAssessmentResult(mappedRiskAssessment)
    : calculatedRiskAssessment
    ? convertToRiskAssessmentResult(calculatedRiskAssessment)
    : hookRiskAssessment
    ? convertToRiskAssessmentResult(hookRiskAssessment)
    : riskAssessment;

  return (
    <div>
      <RiskAssessmentDisplay
        riskAssessment={convertedRiskAssessment}
        displayResponse={displayResponse}
        checklistItems={
          mappedRiskAssessment?.checklistItems ||
          hookRiskAssessment?.checklistItems
        }
        onChecklistItemChange={handleChecklistItemChange}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='taxCert'
        initialJsonData={jsonDetails || {}}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />
    </div>
  );
};
