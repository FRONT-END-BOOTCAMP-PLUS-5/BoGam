import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransactionSearch,
  CreateTransactionSearchRequestDto,
  transactionSearchCopyApi,
  TransactionSearchCopyExistsResponse,
  TransactionSearchCopyApiResponse,
  TransactionSearchApiResponse,
} from '@libs/api_front/transactionSearch.api';

// React Query Hook - 실거래가 검색 데이터 저장
export const useCreateTransactionSearch = (
  onSuccess?: (data: TransactionSearchApiResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<TransactionSearchApiResponse, Error, CreateTransactionSearchRequestDto>({
    mutationFn: createTransactionSearch,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      if (variables.userAddressNickname) {
        queryClient.invalidateQueries({
          queryKey: ['transactionSearchCopy', 'exists', variables.userAddressNickname],
        });
        queryClient.invalidateQueries({
          queryKey: ['transactionSearchCopy', variables.userAddressNickname],
        });
      }

      // 콜백 실행
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('실거래가 검색 데이터 저장 실패:', error);
    },
  });
};

// 실거래가 검색 복사본 존재 여부 확인
export const useCheckTransactionSearchCopyExists = (userAddressNickname: string | null) => {
  return useQuery<TransactionSearchCopyExistsResponse>({
    queryKey: ['transactionSearchCopy', 'exists', userAddressNickname],
    queryFn: (): Promise<TransactionSearchCopyExistsResponse> => 
      transactionSearchCopyApi.checkTransactionSearchCopyExists(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};

// 실거래가 검색 복사본 조회
export const useGetTransactionSearchCopy = (userAddressNickname: string | null) => {
  return useQuery<TransactionSearchCopyApiResponse>({
    queryKey: ['transactionSearchCopy', userAddressNickname],
    queryFn: (): Promise<TransactionSearchCopyApiResponse> => 
      transactionSearchCopyApi.getTransactionSearchCopy({ userAddressNickname: userAddressNickname! }),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};
