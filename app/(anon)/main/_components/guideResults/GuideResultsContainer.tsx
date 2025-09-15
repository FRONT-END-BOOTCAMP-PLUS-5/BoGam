'use client';

import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { StepResultData } from '@libs/api_front/stepResultQueries.api';
import GuideResultSummary from '../../../mypage/_components/GuideResultSummary';
import GuideResultView from '../../../mypage/_components/GuideResultView';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

// 가이드 요약 데이터 타입 정의
interface GuideSummaryData {
  totalMatch: number;
  totalMismatch: number;
  totalUnchecked: number;
}

// API 응답 데이터 타입 정의
interface StepResultResponseData {
  results: StepResultData[];
  summary: {
    totalMismatch: number;
    totalMatch: number;
    totalUnchecked: number;
    stepCount: number;
    stepNumber: number;
  };
}

interface GuideResultsContainerProps {
  selectedAddress: UserAddress | null;
  isNewAddressSearch: boolean;
}

export const GuideResultsContainer: React.FC<GuideResultsContainerProps> = ({
  selectedAddress,
  isNewAddressSearch,
}) => {
  // 새로 주소를 등록한 경우에는 step_result 데이터가 없기 때문에 fetch를 진행하지 않음
  const { data: stepResultsData } = useGetStepResult(
    {
      userAddressNickname: selectedAddress?.nickname || '',
      stepNumber: '',
      detail: '',
    },
    {
      enabled: !isNewAddressSearch && !!selectedAddress?.nickname, // 새 주소 검색이 아니고 닉네임이 있을 때만 fetch
    }
  );

  // guideSteps와 guideSummary 데이터 처리
  let guideSteps: StepResultData[] = [];
  let guideSummary: GuideSummaryData = {
    totalMatch: 0,
    totalMismatch: 0,
    totalUnchecked: 0,
  };

  if (stepResultsData) {
    if (
      (stepResultsData as StepResultResponseData).results &&
      (stepResultsData as StepResultResponseData).summary
    ) {
      // {results: Array, summary: {...}} 구조
      const responseData = stepResultsData as StepResultResponseData;
      guideSteps = responseData.results;
      guideSummary = {
        totalMatch: responseData.summary.totalMatch || 0,
        totalMismatch: responseData.summary.totalMismatch || 0,
        totalUnchecked: responseData.summary.totalUnchecked || 0,
      };
    }
  }

  // 새로 주소를 등록한 경우에는 가이드 결과를 표시하지 않음
  if (isNewAddressSearch) {
    return null;
  }

  return (
    <>
      {/* 가이드 결과 요약 */}
      <GuideResultSummary
        match={guideSummary.totalMatch}
        mismatch={guideSummary.totalMismatch}
        unchecked={guideSummary.totalUnchecked}
      />

      {/* 가이드 결과 보기 */}
      <GuideResultView guideSteps={guideSteps} />
    </>
  );
};
