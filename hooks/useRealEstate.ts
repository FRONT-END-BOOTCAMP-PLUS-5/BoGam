import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RealEstateFormData,
} from '@/(anon)/_components/common/realEstate/types';
import { 
  realEstateApi,
  RealEstateSearchResponse,
  RealEstateCopyApiResponse,
  RealEstateExistsResponse
} from '@libs/api_front/realEstate.api';

// 데이터 존재 여부 확인
export const useCheckRealEstateExists = (nickname?: string) => {
  return useQuery<RealEstateExistsResponse | null>({
    queryKey: ['realEstate', 'exists', nickname],
    queryFn: async (): Promise<RealEstateExistsResponse | null> => {
      if (!nickname) return null;

      try {
        return realEstateApi.checkRealEstateCopyExists(nickname);
      } catch (error) {
        console.error('등기부등본 존재 여부 확인 실패:', error);
        throw error;
      }
    },
    enabled: !!nickname,
    retry: 2, // 실패 시 2번 재시도
    retryDelay: 1000, // 1초 후 재시도
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// DB에서 등기부등본 데이터 조회
export const useGetRealEstateFromDB = (userAddressNickname?: string) => {
  return useQuery<RealEstateCopyApiResponse | null>({
    queryKey: ['realEstate', 'db', userAddressNickname],
    queryFn: async (): Promise<RealEstateCopyApiResponse | null> => {
      if (!userAddressNickname) return null;

      try {
        return realEstateApi.getRealEstateCopy(userAddressNickname);
      } catch (error) {
        console.error('등기부등본 DB 조회 실패:', error);
        throw error;
      }
    },
    enabled: !!userAddressNickname,
    retry: 2, // 실패 시 2번 재시도
    retryDelay: 1000, // 1초 후 재시도
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// 외부 API에서 등기부등본 조회 및 DB 저장
export const useCreateRealEstate = (
  onSuccess?: (data: RealEstateSearchResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<RealEstateSearchResponse, Error, RealEstateFormData & { userAddressNickname: string }>({
    mutationFn: async (
      data: RealEstateFormData & { userAddressNickname: string }
    ): Promise<RealEstateSearchResponse> => {
      try {
        return realEstateApi.searchByAddress(data);
      } catch (error) {
        console.error('등기부등본 생성 실패:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['realEstate', 'exists', variables.userAddressNickname],
      });
      queryClient.invalidateQueries({
        queryKey: ['realEstate', 'db', variables.userAddressNickname],
      });

      // 콜백 실행
      if (onSuccess) {
        onSuccess(data);
      }
    },
  });
};

// 2-way 인증 요청
export const useTwoWayAuth = (
  onSuccess?: (data: RealEstateSearchResponse) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<RealEstateSearchResponse, Error, Record<string, unknown>>({
    mutationFn: async (data: Record<string, unknown>): Promise<RealEstateSearchResponse> => {
      try {
        return realEstateApi.searchByAddress(data as unknown as RealEstateFormData & { userAddressNickname: string });
      } catch (error) {
        console.error('2-way 인증 실패:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      if (variables.userAddressNickname) {
        queryClient.invalidateQueries({
          queryKey: ['realEstate', 'exists', variables.userAddressNickname],
        });
        queryClient.invalidateQueries({
          queryKey: ['realEstate', 'db', variables.userAddressNickname],
        });
      }

      // 콜백 실행
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      // 에러 콜백 실행
      if (onError) {
        onError(error);
      }
    },
  });
};
