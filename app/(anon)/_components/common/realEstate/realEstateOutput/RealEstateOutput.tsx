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
import { convertRealEstateRiskAssessmentToJson } from '@utils/riskAssessmentUtils';

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
      console.log('위험도 검사 결과 자동 저장 완료');
      // 저장 성공 시 캐시 무효화하여 데이터 다시 로드
      invalidateRiskDataCache();
    } else {
      console.error('위험도 검사 결과 자동 저장 실패:', data.error);
    }
  });

  // 위험도 검사 실행 상태 관리
  const [isPerformingRiskAssessment, setIsPerformingRiskAssessment] =
    useState(false);

  // 위험도 검사 실행 여부를 추적하는 ref
  const hasPerformedRiskAssessment = useRef(false);

  // 위험도 검사 결과가 없을 때 자동으로 위험도 검사 실행
  useEffect(() => {
    const performRiskAssessment = async () => {
      if (
        !loadLoading &&
        !savedRiskData &&
        !isPerformingRiskAssessment &&
        !hasPerformedRiskAssessment.current &&
        hasData &&
        displayResponse?.data?.realEstateJson?.data &&
        selectedAddress?.nickname
      ) {
        try {
          hasPerformedRiskAssessment.current = true;
          setIsPerformingRiskAssessment(true);

          // 위험도 검사 수행 (Hook 대신 직접 계산)
          const realEstateData = displayResponse.data.realEstateJson.data;

          // 위험도 검사 로직 직접 구현
          const dangerousKeywords = [
            '압류',
            '가압류',
            '경매',
            '강제집행',
            '체납',
            '미납',
            '부도',
            '파산',
            '해지',
            '취소',
          ];

          const keywordChecks = dangerousKeywords.map((keyword) => {
            const fullDataString = JSON.stringify(realEstateData).toLowerCase();
            const found = fullDataString.includes(keyword.toLowerCase());
            return {
              keyword,
              passed: !found,
              foundCount: found ? 1 : 0,
            };
          });

          const passedKeywords = keywordChecks.filter(
            (check) => check.passed
          ).length;

          const riskAssessment = {
            stepNumber: 1,
            riskLevel: (passedKeywords >= 8
              ? 'LOW'
              : passedKeywords >= 6
              ? 'MEDIUM'
              : 'HIGH') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
            riskFactors: [],
            totalRiskScore: 0,
            recommendations: [],
            keywordChecks,
            totalKeywords: dangerousKeywords.length,
            passedKeywords,
          };

          // JSON으로 변환
          const jsonData =
            convertRealEstateRiskAssessmentToJson(riskAssessment);

          // 위험도 검사 결과 저장
          saveRiskAssessmentMutation.mutate({
            stepNumber,
            detail,
            jsonData,
            domain: 'realEstate',
            userAddressNickname: selectedAddress.nickname,
          });
        } catch (error) {
          console.error('위험도 검사 자동 실행 중 오류:', error);
        } finally {
          setIsPerformingRiskAssessment(false);
        }
      }
    };

    performRiskAssessment();
  }, [
    loadLoading,
    savedRiskData,
    isPerformingRiskAssessment,
    hasData,
    displayResponse,
    selectedAddress,
    stepNumber,
    detail,
    saveRiskAssessmentMutation,
    invalidateRiskDataCache,
  ]);

  // 로딩 중일 때
  if (totalLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
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
        riskAssessment={riskAssessment}
        displayResponse={displayResponse}
        stepNumber={stepNumber}
        detail={detail}
        userAddressNickname={selectedAddress?.nickname}
        domain='realEstate'
        initialJsonData={savedRiskData?.jsonData}
        showSaveButton={true} // 결과 탭에서도 저장 버튼 활성화
      />

      {displayResponse?.data?.data &&
      typeof displayResponse.data.data === 'object' &&
      'resOriGinalData' in displayResponse.data.data &&
      typeof (displayResponse.data.data as Record<string, unknown>)
        .resOriGinalData === 'string' ? (
        <div className={styles.pdfSection}>
          <h3 className={styles.pdfTitle}>등기부등본 PDF</h3>
          <PdfViewer
            base64={
              (displayResponse.data.data as Record<string, unknown>)
                .resOriGinalData as string
            }
            fileName='등기부등본.pdf'
          />
        </div>
      ) : null}
    </div>
  );
};
