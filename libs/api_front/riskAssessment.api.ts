import { frontendAxiosInstance } from './axiosInstance';
import { RiskAssessmentJsonData } from '@utils/riskAssessmentUtils';

// 위험도 검사 저장 API
export const saveRiskAssessmentAPI = async (params: {
  stepNumber: number;
  detail: number;
  jsonData: RiskAssessmentJsonData;
  domain: 'realEstate' | 'broker' | 'taxCert';
  userAddressNickname: string;
}) => {
  const response = await frontendAxiosInstance
    .getAxiosInstance()
    .post('/api/step-results', {
      userAddressNickname: params.userAddressNickname,
      stepNumber: params.stepNumber,
      detail: params.detail,
      jsonDetails: params.jsonData, // jsonDetails 필드로 저장
    });

  return response.data as {
    success: boolean;
    data?: unknown;
    error?: string;
  };
};

// 위험도 검사 로드 API
export const loadRiskAssessmentAPI = async (params: {
  stepNumber: number;
  detail: number;
  userAddressNickname: string;
}) => {
  const response = await frontendAxiosInstance
    .getAxiosInstance()
    .get('/api/step-results', {
      params: {
        userAddressNickname: params.userAddressNickname,
        stepNumber: params.stepNumber,
        detail: params.detail,
      },
    });

  return response.data as {
    success: boolean;
    data?: unknown;
    error?: string;
  };
};
