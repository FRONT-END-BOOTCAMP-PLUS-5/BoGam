import { useQuery } from '@tanstack/react-query';
import {
  danjiSerialNumberApi,
  DanjiSerialNumberRequestParams,
} from '@libs/api_front/danjiSerialNumber.api';

// 실제 API 응답 구조에 맞춘 타입
export interface ActualDanjiInfo {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface UseDanjiSerialNumberParams {
  addrSido: string;
  addrSigungu: string;
  addrDong: string;
}

export const useDanjiSerialNumber = (
  searchParams: UseDanjiSerialNumberParams
) => {
  return useQuery<ActualDanjiInfo[]>({
    queryKey: ['danjiSerialNumber', searchParams],
    queryFn: async (): Promise<ActualDanjiInfo[]> => {
      const params: DanjiSerialNumberRequestParams = {
        organization: '0010',
        year: new Date().getFullYear().toString(),
        type: '0', // 기본값: 아파트
        searchGbn: '1', // 기본값: 도로명주소
        addrSido: searchParams.addrSido,
        addrSigungu: searchParams.addrSigungu,
        addrDong: searchParams.addrDong,
      };

      const response = await danjiSerialNumberApi.getDanjiSerialNumber(params);

      if (response.data) {
        // response.data가 배열인지 확인하고, 배열이 아니면 빈 배열로 설정
        const dataArray = Array.isArray(response.data) ? response.data : [];
        return dataArray;
      } else {
        throw new Error(
          response.result.message || '단지 목록 조회에 실패했습니다.'
        );
      }
    },
    enabled: !!(
      searchParams.addrSido &&
      searchParams.addrSigungu &&
      searchParams.addrDong
    ),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (React Query v5에서는 cacheTime이 gcTime으로 변경됨)
  });
};
