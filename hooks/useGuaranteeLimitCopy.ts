import { useQuery, useMutation } from '@tanstack/react-query';
import GuaranteeLimitCopyApi from '@libs/api_front/guaranteeLimitCopy.api';

// API 인스턴스
const guaranteeLimitCopyApi = GuaranteeLimitCopyApi.getInstance();

// 보증한도 복사본 존재 여부 확인
export const useCheckGuaranteeLimitCopyExists = (nickname: string) => {
  return useQuery({
    queryKey: ['guaranteeLimitCopy', 'exists', nickname],
    queryFn: () => guaranteeLimitCopyApi.checkGuaranteeLimitCopyExists(nickname),
    enabled: !!nickname,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

// 보증한도 복사본 조회
export const useGetGuaranteeLimitCopy = (nickname: string | null) => {
  return useQuery({
    queryKey: ['guaranteeLimitCopy', nickname],
    queryFn: () => guaranteeLimitCopyApi.getGuaranteeLimitCopy({ userAddressNickname: nickname! }),
    enabled: !!nickname,
    staleTime: 0, // 항상 최신 데이터 요청
  });
};

// 보증한도 복사본 생성/수정
export const useCreateGuaranteeLimitCopy = () => {
  return useMutation({
    mutationFn: ({ userAddressNickname, guaranteeLimitJson }: { userAddressNickname: string; guaranteeLimitJson: string }) =>
      guaranteeLimitCopyApi.createGuaranteeLimitCopy({ userAddressNickname, guaranteeLimitJson }),
  });
};
