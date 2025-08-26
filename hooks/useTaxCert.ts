import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { frontendAxiosInstance } from '@libs/api_front/axiosInstance';

// 납세증명서 복사본 존재 여부 확인
export const useCheckTaxCertCopyExists = (nickname: string | null) => {
  return useQuery({
    queryKey: ['taxCertCopyExists', nickname],
    queryFn: async () => {
      if (!nickname) {
        return { success: false, exists: false };
      }
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get(`/api/tax-cert/exists?nickname=${encodeURIComponent(nickname)}`);
      return response.data;
    },
    enabled: !!nickname,
  });
};

// 납세증명서 복사본 조회
export const useGetTaxCertCopy = (nickname: string | null) => {
  return useQuery({
    queryKey: ['taxCertCopy', nickname],
    queryFn: async () => {
      if (!nickname) {
        return null;
      }
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .get(
          `/api/copies/tax-cert?userAddressNickname=${encodeURIComponent(
            nickname
          )}`
        );
      return response.data;
    },
    enabled: !!nickname,
  });
};

// 납세증명서 제출
export const useSubmitTaxCert = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: async (data: {
      organization: string;
      loginType: string;
      isIdentityViewYN: string;
      proofType: string;
      submitTargets: string;
      userAddressNickname: string;
      is2Way?: boolean;
      certType?: string;
      certFile?: string;
      keyFile?: string;
      certPassword?: string;
      userId?: string;
      userPassword?: string;
      userName?: string;
      loginIdentity?: string;
      loginTypeLevel?: string;
      phoneNo?: string;
      telecom?: string;
      identityEncYn?: string;
      loginBirthDate?: string;
      // CommonFields에서 추가된 필드들
      applicationType?: string;
      clientTypeLevel?: string;
      identity?: string;
      birthDate?: string;
      // API 공식문서 필수 필드들
      isAddrViewYn?: string;
      originDataYN?: string;
      originDataYN1?: string;
      id?: string;
      // 2-way 인증 관련 필드
      twoWayInfo?: {
        jobIndex?: number;
        threadIndex?: number;
        jti?: string;
        twoWayTimestamp?: number;
      };
      simpleAuth?: string;
    }) => {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .post('/api/tax-cert', data);
      return response.data;
    },
    onSuccess,
    onError,
  });
};

// 간편인증 2-way 인증
export const useSubmitTwoWayAuth = (
  onSuccess?: (data: unknown) => void,
  onError?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      organization: string;
      loginType: string;
      isIdentityViewYN: string;
      proofType: string;
      submitTargets: string;
      userAddressNickname: string;
      is2Way: boolean;
      userName?: string;
      loginIdentity?: string;
      loginTypeLevel?: string;
      phoneNo?: string;
      telecom?: string;
      identityEncYn?: string;
      loginBirthDate?: string;
      applicationType?: string;
      clientTypeLevel?: string;
      identity?: string;
      birthDate?: string;
      isAddrViewYn?: string;
      originDataYN?: string;
      originDataYN1?: string;
      id?: string;
      // 2-way 인증 관련 필드
      twoWayInfo?: {
        jobIndex?: number;
        threadIndex?: number;
        jti?: string;
        twoWayTimestamp?: number;
      };
      simpleAuth?: string;
      simpleKeyToken?: string;
      rValue?: string;
      certificate?: string;
      extraInfo?: Record<string, unknown>;
    }) => {
      const response = await frontendAxiosInstance
        .getAxiosInstance()
        .post('/api/tax-cert', data);
      return response.data;
    },
    onSuccess: (data: unknown) => {
      if (data.success === true) {
        console.log("data", data);
        console.log("data.data.userAddressNickname", (data.data.userAddressNickname).split("+").join(" "));
        console.log("queryClient data(납세증명서 발급)", queryClient.getQueryData(['taxCert', 'exists', (data.data.userAddressNickname).split("+").join(" ")]));
        queryClient.invalidateQueries({ queryKey: ['taxCert', 'exists', (data.data.userAddressNickname).split("+").join(" ")] });
        queryClient.invalidateQueries({ queryKey: ['taxCertCopy'] });
      }
    },
    onError,
  });
};
