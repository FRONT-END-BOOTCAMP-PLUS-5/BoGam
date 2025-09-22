import { useMutation, useQuery } from '@tanstack/react-query';
import {
  brokerApi,
  BrokerSearchParams,
  CreateBrokerCopyParams,
  BrokerApiResponse,
} from '@libs/api_front/broker.api';

// 중개사 복사본 존재 여부 확인 쿼리
export const useCheckBrokerCopyExists = (
  userAddressNickname: string | null
) => {
  return useQuery<BrokerApiResponse>({
    queryKey: ['broker', 'exists', userAddressNickname],
    queryFn: (): Promise<BrokerApiResponse> => brokerApi.checkExists(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};

// 중개사 복사본 DB 조회 쿼리
export const useGetBrokerCopy = (userAddressNickname: string | null) => {
  return useQuery<BrokerApiResponse>({
    queryKey: ['broker', 'copy', userAddressNickname],
    queryFn: (): Promise<BrokerApiResponse> => brokerApi.getBrokerCopy(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 0,
  });
};

// 중개사 정보 조회 뮤테이션
export const useSearchBrokers = () => {
  return useMutation<BrokerApiResponse, Error, BrokerSearchParams>({
    mutationFn: (params: BrokerSearchParams): Promise<BrokerApiResponse> => brokerApi.searchBrokers(params),
    onSuccess: (data: BrokerApiResponse) => {
      if (data.success) {
        console.log('중개사 정보 조회 성공');
      } else {
        console.error('중개사 정보 조회 실패:', data.error);
      }
    },
    onError: (error: Error) => {
      console.error('중개사 정보 조회 API 오류:', error);
    },
  });
};

// 중개사 복사본 생성/수정 뮤테이션
export const useCreateBrokerCopy = () => {
  return useMutation<BrokerApiResponse, Error, CreateBrokerCopyParams>({
    mutationFn: (params: CreateBrokerCopyParams): Promise<BrokerApiResponse> =>
      brokerApi.createBrokerCopy(params),
    onSuccess: (data: BrokerApiResponse) => {
      if (data.success) {
        console.log('중개사 복사본 저장 성공');
      } else {
        console.error('중개사 복사본 저장 실패:', data.error);
      }
    },
    onError: (error: Error) => {
      console.error('중개사 복사본 저장 API 오류:', error);
    },
  });
};
