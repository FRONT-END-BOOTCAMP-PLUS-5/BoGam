import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetTaxCertResponseDto } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { 
  taxCertApi,
  TaxCertApiResponse,
  TaxCertCopyApiResponse,
  TaxCertExistsResponse,
  TaxCertIssueRequest
} from '@libs/api_front/taxCert.api';

// 납세증명서 존재 여부 확인
export const useCheckTaxCertExists = (userAddressNickname: string) => {
  return useQuery<TaxCertExistsResponse>({
    queryKey: ['taxCert', 'exists', userAddressNickname],
    queryFn: () => taxCertApi.checkTaxCertExists(userAddressNickname),
    enabled: !!userAddressNickname,
  });
};

// 납세증명서 복사본 조회
export const useGetTaxCertCopy = (userAddressNickname: string | null) => {
  return useQuery<TaxCertCopyApiResponse | null>({
    queryKey: ['taxCertCopy', userAddressNickname],
    queryFn: async (): Promise<TaxCertCopyApiResponse | null> => {
      if (!userAddressNickname) {
        return null;
      }
      return taxCertApi.getTaxCertCopy({ userAddressNickname: userAddressNickname });
    },
    enabled: !!userAddressNickname,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 납세증명서 제출
export const useSubmitTaxCert = (
  onSuccess?: (data: TaxCertApiResponse) => void,
  onError?: (error: unknown) => void
) => {
  return useMutation<TaxCertApiResponse, Error, TaxCertIssueRequest>({
    mutationFn: async (data: TaxCertIssueRequest): Promise<TaxCertApiResponse> => {
      return taxCertApi.issueTaxCert(data);
    },
    onSuccess,
    onError,
  });
};

// 간편인증 2-way 인증
export const useSubmitTwoWayAuth = (
  onSuccess?: (data: GetTaxCertResponseDto) => void,
  onError?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation<GetTaxCertResponseDto, Error, TaxCertIssueRequest>({
    mutationFn: async (data: TaxCertIssueRequest): Promise<GetTaxCertResponseDto> => {
      return taxCertApi.issueTaxCert(data) as Promise<GetTaxCertResponseDto>;
    },
    onSuccess: (data: GetTaxCertResponseDto, variables) => {
      if (data.success === true && variables.userAddressNickname) {
        const formattedAddress = variables.userAddressNickname
          .split('+')
          .join(' ');
        queryClient.invalidateQueries({
          queryKey: ['taxCert', 'exists', formattedAddress],
        });
        queryClient.invalidateQueries({
          queryKey: ['taxCertCopy', formattedAddress],
        });
      }
      // onSuccess 콜백 호출 추가
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};