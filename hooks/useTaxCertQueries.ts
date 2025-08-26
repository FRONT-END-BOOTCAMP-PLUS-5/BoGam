import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxCertApi, TaxCertIssueRequest } from '@libs/api_front/taxCert.api';
import { frontendAxiosInstance } from '@libs/api_front/axiosInstance';

export const useCheckTaxCertExists = (nickname: string) => {
  const queryClient = useQueryClient();
  console.log("queryCLient data(존재 확인)", queryClient.getQueryData(['taxCert', 'exists', nickname]));
  console.log("nickname", nickname);
  return useQuery({
    queryKey: ['taxCert', 'exists', nickname],
    queryFn: () => taxCertApi.checkTaxCertExists(nickname),
    enabled: !!nickname,
    staleTime: 0,
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

export const useIssueTaxCert = () => {
  return useMutation({
    mutationFn: (data: TaxCertIssueRequest) => taxCertApi.issueTaxCert(data),
  });
};
