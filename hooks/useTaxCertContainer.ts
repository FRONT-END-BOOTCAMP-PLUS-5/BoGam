import React, { useEffect, useCallback } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useTaxCertStore } from '@libs/stores/taxCertStore';
import { useCheckTaxCertExists } from '@/hooks/useTaxCert';
import { useSubmitTaxCert, useSubmitTwoWayAuth } from '@/hooks/useTaxCert';
import {
  TaxCertFormData,
  TaxCertApiResponse,
} from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/types';
import { extractActualData } from '@libs/responseUtils';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export const useTaxCertContainer = () => {
  // Store에서 상태 가져오기
  const {
    activeTab,
    setActiveTab,
    formData,
    isDataLoading,
    setIsDataLoading,
    handleShowSimpleAuthModal,
    handleSimpleAuthCancel,
  } = useTaxCertStore();

  const { selectedAddress } = useUserAddressStore();
  const { data: existsData, refetch: refetchExists } = useCheckTaxCertExists(
    selectedAddress?.nickname || ''
  );

  const submitTaxCertMutation = useSubmitTaxCert();

  const submitTwoWayAuthMutation = useSubmitTwoWayAuth(
    async () => {
      // DB에 저장되므로 별도로 response 저장 불필요
      setIsDataLoading(false);
      setActiveTab('output');
      handleSimpleAuthCancel(); // 성공 시 모달 닫기
      // existsData 갱신
      refetchExists();
    },
    (error) => {
      console.error('간편인증 API 호출 중 오류:', error);
      setIsDataLoading(false);
      handleSimpleAuthCancel(); // 실패 시에도 모달 닫기
    }
  );

  useEffect(() => {
    if (!existsData) return;
    const existsDataTyped = existsData as { success: boolean; exists: boolean };
    if (existsDataTyped.success && existsDataTyped.exists) {
      setActiveTab('output');
      setIsDataLoading(false);
    } else if (existsDataTyped.success && !existsDataTyped.exists) {
      setActiveTab('input');
      setIsDataLoading(false);
    }
  }, [existsData, isDataLoading, setActiveTab, setIsDataLoading]);

  // useEffect(() => {
  //   const existsDataTyped = existsData as { success: boolean; exists: boolean };
  //   if (
  //     activeTab === 'output' &&
  //     existsDataTyped?.success &&
  //     !existsDataTyped.exists
  //   ) {
  //     setActiveTab('input');
  //   }
  // }, [activeTab, existsData]);

  const handleFirstRequestComplete = (responseData: TaxCertApiResponse) => {
    const actualData = extractActualData(
      responseData as unknown as CodefResponse
    );

    const actualContinue2Way = actualData?.continue2Way;
    const actualMethod = actualData?.method;

    if (actualContinue2Way && actualMethod === 'simpleAuth') {
      handleShowSimpleAuthModal();
      return true;
    } else {
      return false;
    }
  };

  // 2-way 인증에 필요한 임시 response 저장 (로컬 상태)
  const [tempResponse, setTempResponse] =
    React.useState<TaxCertApiResponse | null>(null);

  const handleSimpleAuthApprove = useCallback(async () => {
    if (!selectedAddress?.nickname) {
      alert('선택된 주소 정보가 없습니다.');
      return;
    }

    // 1차 응답에서 실제 데이터 추출
    const responseActualData = tempResponse
      ? extractActualData(tempResponse as unknown as CodefResponse)
      : undefined;

    // 1차 응답에서 twoWayInfo 추출
    const twoWayInfo = {
      jobIndex: responseActualData?.jobIndex || 0,
      threadIndex: responseActualData?.threadIndex || 0,
      jti: responseActualData?.jti || '',
      twoWayTimestamp: responseActualData?.twoWayTimestamp || Date.now(),
    };

    // 1차 응답에서 간편인증 토큰들 추출
    const simpleKeyToken =
      responseActualData?.simpleKeyToken ||
      responseActualData?.extraInfo?.simpleKeyToken;
    const rValue =
      responseActualData?.rValue || responseActualData?.extraInfo?.rValue;
    const certificate =
      responseActualData?.certificate ||
      responseActualData?.extraInfo?.certificate;

    const twoWayRequest = {
      ...formData,
      userAddressNickname: selectedAddress.nickname,
      is2Way: true,
      twoWayInfo,
      simpleAuth: '1',
      simpleKeyToken,
      rValue,
      certificate,
    };

    submitTwoWayAuthMutation.mutate(twoWayRequest);
    // onSimpleAuthApprove() 호출 제거 - 무한 루프 방지
  }, [selectedAddress, tempResponse, formData, submitTwoWayAuthMutation]);

  const handleSubmit = async (data: TaxCertFormData) => {
    if (!selectedAddress) {
      alert('주소를 선택해주세요.');
      return;
    }

    const requestData = {
      ...data,
      userAddressNickname: selectedAddress.nickname,
    };

    try {
      const responseData = await submitTaxCertMutation.mutateAsync(requestData);
      setTempResponse(responseData as TaxCertApiResponse);

      // 1차 요청 완료 처리 - 기존 방식과 동일
      const needsTwoWay = handleFirstRequestComplete(
        responseData as TaxCertApiResponse
      );

      if (!needsTwoWay) {
        // 추가인증이 필요하지 않은 경우 바로 결과 탭으로
        setActiveTab('output');
        // existsData 갱신
        refetchExists();
      }
      // needsTwoWay가 true인 경우 모달이 이미 표시됨
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      alert('API 호출 중 오류가 발생했습니다.');
    }
  };

  return {
    formData,
    existsData,
    submitTaxCertMutation,
    submitTwoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSubmit,
    handleSimpleAuthApprove,
  };
};
