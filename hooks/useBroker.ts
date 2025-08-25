import { useMutation, useQuery } from '@tanstack/react-query';
import {
  brokerApi,
  BrokerSearchParams,
  CreateBrokerCopyParams,
} from '@libs/api_front/broker.api';

// 중개사 복사본 존재 여부 확인 쿼리
export const useCheckBrokerCopyExists = (
  userAddressNickname: string | null
) => {
  return useQuery({
    queryKey: ['broker', 'exists', userAddressNickname],
    queryFn: () => brokerApi.checkExists(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 중개사 복사본 DB 조회 쿼리
export const useGetBrokerCopy = (userAddressNickname: string | null) => {
  return useQuery({
    queryKey: ['broker', 'copy', userAddressNickname],
    queryFn: () => brokerApi.getBrokerCopy(userAddressNickname!),
    enabled: !!userAddressNickname,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 중개사 정보 조회 뮤테이션
export const useSearchBrokers = () => {
  return useMutation({
    mutationFn: (params: BrokerSearchParams) => brokerApi.searchBrokers(params),
    onSuccess: (data) => {
      if (data.success) {
      } else {
        console.error('중개사 정보 조회 실패:', data.error);
      }
    },
    onError: (error) => {
      console.error('중개사 정보 조회 API 오류:', error);
    },
  });
};

// 중개사 복사본 생성/수정 뮤테이션
export const useCreateBrokerCopy = () => {
  return useMutation({
    mutationFn: (params: CreateBrokerCopyParams) =>
      brokerApi.createBrokerCopy(params),
    onSuccess: (data) => {
      if (data.success) {
      } else {
        console.error('중개사 복사본 저장 실패:', data.error);
      }
    },
    onError: (error) => {
      console.error('중개사 복사본 저장 API 오류:', error);
    },
  });
};
