import { useState } from 'react';
import axios from 'axios';
import { CodefResponse } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { GetTaxCertRequestDto } from '@be/applications/taxCert/dtos/GetTaxCertRequestDto';
import { API_ENDPOINTS } from '@libs/api-endpoints';
import { formatPhone } from '@utils/formatUtils';
import { extractActualData } from '@libs/responseUtils';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useTaxCertApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<CodefResponse | null>(null);
  
  // 전역 스토어에서 선택된 주소의 닉네임 가져오기
  const selectedAddressNickname = useUserAddressStore((state) => state.selectedAddress?.nickname);

  const submitTaxCert = async (formData: GetTaxCertRequestDto) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📋 폼 데이터:', formData);

      // userAddressNickname 필드 추가 및 전화번호 포맷팅
      const requestData = {
        ...formData,
        phoneNo: formatPhone(formData.phoneNo || ''),
        userAddressNickname: selectedAddressNickname || '기본주소',
      };
      
      console.log("requestData@@@@@", requestData);
      const apiResponse = await axios.post(
        API_ENDPOINTS.TAX_CERT,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log("apiResponse@@@@@", apiResponse);
      const data = apiResponse.data as CodefResponse;

      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String(data.error));
      }

      console.log('✅ API 응답:', data);
      setResponse(data);

      return data;
    } catch (error) {
      console.error('❌ API 요청 오류:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitTwoWayAuth = async (
    formData: GetTaxCertRequestDto,
    simpleAuth: string,
    extraInfo?: Record<string, unknown>
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔐 추가인증 요청:', { simpleAuth, extraInfo });

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

      console.log('🔐 twoWayInfo:', twoWayInfo);

      // 1차 응답에서 간편인증 토큰들 추출
      const simpleKeyToken =
        responseActualData?.simpleKeyToken ||
        responseActualData?.extraInfo?.simpleKeyToken;
      const rValue =
        responseActualData?.rValue || responseActualData?.extraInfo?.rValue;
      const certificate =
        responseActualData?.certificate ||
        responseActualData?.extraInfo?.certificate;

      console.log('🔐 간편인증 토큰들:', {
        simpleKeyToken,
        rValue,
        certificate,
      });

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

      console.log(
        '🔐 2차 요청 데이터:',
        JSON.stringify(twoWayRequest, null, 2)
      );

      const apiResponse = await axios.post(
        API_ENDPOINTS.TAX_CERT,
        twoWayRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = apiResponse.data as CodefResponse;

      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(String(data.error));
      }

      console.log('🔐 추가인증 응답:', data);
      setResponse(data);

      return data;
    } catch (error) {
      console.error('❌ 추가인증 요청 오류:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
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
