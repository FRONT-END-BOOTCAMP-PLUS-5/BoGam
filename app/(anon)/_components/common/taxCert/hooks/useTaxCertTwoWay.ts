import { useState } from 'react';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { extractActualData } from '@libs/responseUtils';

export const useTaxCertTwoWay = () => {
  const [showSimpleAuthModal, setShowSimpleAuthModal] = useState(false);

  const handleFirstRequestComplete = (responseData: CodefResponse) => {
    const actualData = extractActualData(responseData);

    console.log('🔍 1차 API 응답 데이터 확인:', {
      // 실제 데이터에서 추출
      continue2Way: actualData?.continue2Way,
      method: actualData?.method,
      hasData: !!responseData.data,
      fullData: responseData.data,
      extractedData: actualData,
    });

    // 실제 데이터에서 추가인증 필드 가져오기
    const actualContinue2Way = actualData?.continue2Way;
    const actualMethod = actualData?.method;

    console.log('🔍 실제 값:', {
      actualContinue2Way,
      actualMethod,
      actualData,
    });

    if (actualContinue2Way && actualMethod === 'simpleAuth') {
      console.log('🔐 간편인증 추가인증 필요');

      // 간편인증 추가인증 필요

      // 1차 응답의 간편인증 토큰들 저장 (actualData에서)
      const simpleKeyToken =
        actualData?.simpleKeyToken || actualData?.extraInfo?.simpleKeyToken;
      const rValue = actualData?.rValue || actualData?.extraInfo?.rValue;
      const certificate =
        actualData?.certificate || actualData?.extraInfo?.certificate;

      console.log('🔐 1차 응답 간편인증 토큰들:', {
        simpleKeyToken,
        rValue,
        certificate,
      });

      // 간편인증 모달 표시
      setShowSimpleAuthModal(true);
      return true; // 추가인증 필요
    } else {
      console.log('❌ 추가인증 조건 불만족:', {
        continue2Way: actualContinue2Way,
        method: actualMethod,
        reason: !actualContinue2Way
          ? 'continue2Way가 false 또는 undefined'
          : actualMethod !== 'simpleAuth'
          ? `method가 '${actualMethod}' (simpleAuth가 아님)`
          : '기타',
      });

      // 추가인증이 필요하지 않은 경우
      return false; // 추가인증 불필요
    }
  };

  return {
    showSimpleAuthModal,
    setShowSimpleAuthModal,
    handleFirstRequestComplete,
  };
};
