import { useState } from 'react';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { formatPhone } from '@utils/formatUtils';
import { extractActualData } from '@libs/responseUtils';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useIssueTaxCert } from '@/hooks/useTaxCertQueries';
import { TaxCertIssueRequest } from '@libs/api_front/taxCert.api';

export const useTaxCertApi = () => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<CodefResponse | null>(null);
  
  // React Query hook 사용
  const { mutateAsync: issueTaxCert, isPending: isLoading } = useIssueTaxCert();
  
  // 전역 스토어에서 선택된 주소의 닉네임 가져오기
  const selectedAddressNickname = useUserAddressStore((state) => state.selectedAddress?.nickname);

  const submitTaxCert = async (formData: GetTaxCertRequestDto) => {
    try {
      setError(null);

      // userAddressNickname 필드 추가 및 전화번호 포맷팅
      const requestData = {
        ...formData,
        phoneNo: formatPhone(formData.phoneNo || ''),
        userAddressNickname: selectedAddressNickname || '기본주소',
      };
      
      // React Query hook 사용하여 API 호출
      const data = await issueTaxCert(requestData);
      
      setResponse(data.data);

      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    }
  };

  const submitTwoWayAuth = async (
    formData: GetTaxCertRequestDto,
    simpleAuth: string,
    extraInfo?: Record<string, unknown>
  ) => {
    try {
      setError(null);

      // 1차 응답에서 실제 데이터 추출
      const responseActualData = response
        ? extractActualData(response)
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

      const twoWayRequest: GetTaxCertRequestDto = {
        organization: formData.organization,
        loginType: formData.loginType,
        isIdentityViewYN: formData.isIdentityViewYN,
        isAddrViewYn: formData.isAddrViewYn,
        proofType: formData.proofType,
        submitTargets: formData.submitTargets,
        applicationType: formData.applicationType,
        clientTypeLevel: formData.clientTypeLevel,
        id: formData.id,
        userName: formData.userName,
        loginIdentity: formData.loginIdentity,
        loginBirthDate: formData.loginBirthDate,
        phoneNo: formatPhone(formData.phoneNo || ''),
        loginTypeLevel: formData.loginTypeLevel,
        identity: formData.identity,
        birthDate: formData.birthDate,
        originDataYN: formData.originDataYN,
        originDataYN1: formData.originDataYN1,
        is2Way: true,
        twoWayInfo,
        simpleAuth,
        simpleKeyToken,
        rValue,
        certificate,
        userAddressNickname: selectedAddressNickname || '기본주소',
        ...(extraInfo && { extraInfo }),
      };

      // React Query hook 사용하여 API 호출
      const data = await issueTaxCert(twoWayRequest as TaxCertIssueRequest);
      
      setResponse(data.data);

      return data.data;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    }
  };

  return {
    isLoading,
    error,
    response,
    setError,
    submitTaxCert,
    submitTwoWayAuth,
  };
};
