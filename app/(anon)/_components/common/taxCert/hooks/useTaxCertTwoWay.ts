import { useState } from 'react';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { extractActualData } from '@libs/responseUtils';

export const useTaxCertTwoWay = () => {
  const [showSimpleAuthModal, setShowSimpleAuthModal] = useState(false);

  const handleFirstRequestComplete = (responseData: CodefResponse) => {
    const actualData = extractActualData(responseData);

    // 실제 데이터에서 추가인증 필드 가져오기
    const actualContinue2Way = actualData?.continue2Way;
    const actualMethod = actualData?.method;

    if (actualContinue2Way && actualMethod === 'simpleAuth') {
      // 간편인증 추가인증 필요

      // 1차 응답의 간편인증 토큰들 저장 (actualData에서)
      const simpleKeyToken =
        actualData?.simpleKeyToken || actualData?.extraInfo?.simpleKeyToken;
      const rValue = actualData?.rValue || actualData?.extraInfo?.rValue;
      const certificate =
        actualData?.certificate || actualData?.extraInfo?.certificate;

      // 간편인증 모달 표시
      setShowSimpleAuthModal(true);
      return true; // 추가인증 필요
    } else {
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
