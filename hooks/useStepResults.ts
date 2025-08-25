'use client';

import { useState, useEffect } from 'react';
import { stepResultQueryApi, StepResultData } from '@libs/api_front/stepResultQueries.api';

/**
 * 모든 stepResult를 조회하는 훅
 */
export const useStepResults = (userAddressNickname?: string) => {
  const [stepResults, setStepResults] = useState<StepResultData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStepResults = async () => {
    if (!userAddressNickname) {
      setStepResults([]);
      setIsLoading(false); // userAddressNickname이 없을 때도 로딩 상태 해제
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await stepResultQueryApi.getStepResult({ userAddressNickname });
      // 배열인 경우 그대로 사용, 단일 객체인 경우 배열로 변환
      const results = Array.isArray(data) ? data : [data];
      setStepResults(results);
    } catch (err) {
      console.error('Step Results 조회 실패:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStepResults();
  }, [userAddressNickname]);

  // 가이드 요약 데이터 계산
  const guideSummary = stepResults.reduce(
    (acc, result) => {
      acc.match += result.match;
      acc.mismatch += result.mismatch;
      acc.unchecked += result.unchecked;
      return acc;
    },
    { match: 0, mismatch: 0, unchecked: 0 }
  );

  // 가이드 스텝 데이터 변환
  const guideSteps = stepResults.map((result) => ({
    id: result.id,
    userAddressId: result.userAddressId,
    stepId: result.stepId,
    stepNumber: result.stepNumber,
    detail: result.detail,
    match: result.match,
    mismatch: result.mismatch,
    unchecked: result.unchecked,
    jsonDetails: result.jsonDetails,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }));

  return {
    stepResults,
    guideSummary,
    guideSteps,
    isLoading,
    error,
    refetch: fetchStepResults,
  };
};
