'use client';

import { useState, useEffect } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useRiskAssessmentSave } from '@/hooks/useRiskAssessmentSave';
import { parseStepUrl } from '@utils/stepUrlParser';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';
import TaxCertIntro from './TaxCertIntro';
import { TaxCertContainer } from '@/(anon)/_components/common/taxCert/taxCertContainer/TaxCertContainer';

interface TaxCertWrapperProps {
  sectionIndex: number;
  section: {
    type: string;
    data?: any;
  };
}

export default function TaxCertWrapper({
  sectionIndex,
  section,
}: TaxCertWrapperProps) {
  const { selectedAddress } = useUserAddressStore();
  const [jsonData, setJsonData] = useState<RiskAssessmentJsonData>({});

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 5;

  // step-result 데이터 요청
  const { data: stepResultData } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepNumber.toString(),
    detail: detail.toString(),
  });

  const saveRiskAssessmentMutation = useRiskAssessmentSave((data) => {
    if (data.success) {
      console.log('✅ JSON 데이터 저장 완료');
    }
  });

  // 초기 JSON 데이터 로드
  useEffect(() => {
    if (stepResultData) {
      let initialData: RiskAssessmentJsonData = {};

      if (Array.isArray(stepResultData)) {
        initialData = stepResultData[0]?.jsonDetails || {};
      } else if (stepResultData?.jsonDetails) {
        initialData = stepResultData.jsonDetails;
      }

      setJsonData(initialData);
      console.log('🔍 초기 JSON 데이터 로드:', initialData);
    }
  }, [stepResultData]);

  // JSON 데이터 저장 함수
  const saveJsonData = async (newData: RiskAssessmentJsonData) => {
    console.log('🔍 saveJsonData 실행', jsonData);
    if (!selectedAddress?.nickname) return;

    // 기존 데이터와 새로운 데이터를 병합
    const updatedData = {
      ...jsonData, // 기존 데이터 유지
      ...newData, // 새로운 데이터 추가/업데이트
    };

    try {
      await saveRiskAssessmentMutation.mutateAsync({
        stepNumber,
        detail,
        jsonData: updatedData,
        domain: 'taxCert',
        userAddressNickname: selectedAddress.nickname,
      });

      setJsonData(updatedData);
      console.log('✅ JSON 데이터 업데이트 및 저장 완료:', updatedData);
    } catch (error) {
      console.error('❌ JSON 데이터 저장 실패:', error);
    }
  };

  // 슬라이드별 렌더링
  switch (sectionIndex) {
    case 0:
      return (
        <TaxCertIntro
          data={section.data}
          jsonData={jsonData}
          onJsonDataChange={saveJsonData}
        />
      );

    case 1:
      return (
        <TaxCertContainer jsonData={jsonData} onJsonDataChange={saveJsonData} />
      );

    default:
      return null;
  }
}
