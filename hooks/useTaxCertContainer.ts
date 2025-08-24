import { useState, useEffect } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useCheckTaxCertExists } from '@/hooks/useTaxCertQueries';
import { useSubmitTaxCert, useSubmitTwoWayAuth } from '@/hooks/useTaxCert';
import {
  TaxCertFormData,
  TaxCertApiResponse,
} from '@/(anon)/_components/common/taxCert/types';
import { extractActualData } from '@libs/responseUtils';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export const useTaxCertContainer = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [formData] = useState<TaxCertFormData>({
    organization: '0001',
    loginType: '6',
    loginTypeLevel: '1',
    phoneNo: '',
    userName: '',
    loginIdentity: '',
    loginBirthDate: '',
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isIdentityViewYN: '1',
    isAddrViewYn: '0',
    proofType: 'B0006',
    submitTargets: '04',
    applicationType: '01',
    clientTypeLevel: '1',
    identity: '',
    birthDate: '',
    originDataYN: '0',
    originDataYN1: '1',
  });
  const [response, setResponse] = useState<TaxCertApiResponse | null>(null);
  const [showSimpleAuthModal, setShowSimpleAuthModal] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const { selectedAddress } = useUserAddressStore();
  const { data: existsData } = useCheckTaxCertExists(
    selectedAddress?.nickname || ''
  );

  const submitTaxCertMutation = useSubmitTaxCert();

  const submitTwoWayAuthMutation = useSubmitTwoWayAuth(
    async (data) => {
      setResponse(data as TaxCertApiResponse);
      setIsDataLoading(false);
      setActiveTab('output');
    },
    (error) => {
      setResponse({
        success: false,
        message: '간편인증 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        userAddressNickname: selectedAddress?.nickname || '',
      });
      setIsDataLoading(false);
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
  }, [existsData, isDataLoading]);

  useEffect(() => {
    const existsDataTyped = existsData as { success: boolean; exists: boolean };
    if (
      activeTab === 'output' &&
      existsDataTyped?.success &&
      !existsDataTyped.exists
    ) {
      setActiveTab('input');
    }
  }, [activeTab, existsData]);

  const handleFirstRequestComplete = (responseData: TaxCertApiResponse) => {
    const actualData = extractActualData(
      responseData as unknown as CodefResponse
    );

    console.log('🔍 1차 API 응답 데이터 확인:', {
      continue2Way: actualData?.continue2Way,
      method: actualData?.method,
      hasData: !!responseData.data,
      fullData: responseData.data,
      extractedData: actualData,
    });

    const actualContinue2Way = actualData?.continue2Way;
    const actualMethod = actualData?.method;

    console.log('🔍 실제 값:', {
      actualContinue2Way,
      actualMethod,
      actualData,
    });

    if (actualContinue2Way && actualMethod === 'simpleAuth') {
      console.log('🔐 간편인증 추가인증 필요');
      setShowSimpleAuthModal(true);
      return true;
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
      return false;
    }
  };

  const handleSimpleAuthApprove = async () => {
    if (!selectedAddress?.nickname) {
      alert('선택된 주소 정보가 없습니다.');
      return;
    }

    // 1차 응답에서 실제 데이터 추출
    const responseActualData = response
      ? extractActualData(response as unknown as CodefResponse)
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
    setShowSimpleAuthModal(false);
  };

  const handleSimpleAuthCancel = () => {
    setShowSimpleAuthModal(false);
  };

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
      setResponse(responseData as TaxCertApiResponse);

      // 1차 요청 완료 처리 - 기존 방식과 동일
      const needsTwoWay = handleFirstRequestComplete(
        responseData as TaxCertApiResponse
      );

      if (!needsTwoWay) {
        // 추가인증이 필요하지 않은 경우 바로 결과 탭으로
        setActiveTab('output');
      }
      // needsTwoWay가 true인 경우 모달이 이미 표시됨
    } catch (error) {
      setResponse({
        success: false,
        message: 'API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        userAddressNickname: selectedAddress.nickname,
      });
    }
  };

  return {
    formData,
    response,
    showSimpleAuthModal,
    existsData,
    submitTaxCertMutation,
    submitTwoWayAuthMutation,
    isDataLoading,
    activeTab,
    setActiveTab,
    handleSimpleAuthApprove,
    handleSimpleAuthCancel,
    handleSubmit,
  };
};
