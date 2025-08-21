import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { userAddressApi } from '@libs/api_front/userAddress.api';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useUserAddresses = () => {
  const { data: session, status } = useSession();
  const { initializeFromQuery } = useUserAddressStore();

  // initializeFromQuery를 useCallback으로 메모이제이션
  const memoizedInitializeFromQuery = useCallback(
    (data: UserAddress[]) => {
      console.log(
        '🔄 React Query 데이터로 store 초기화:',
        data.length,
        '개 주소'
      );
      initializeFromQuery(data);
    },
    [initializeFromQuery]
  );

  // React Query로 사용자 주소 데이터 가져오기
  const {
    data: userAddressesData,
    isLoading,
    error,
    refetch: fetchUserAddresses,
  } = useQuery({
    queryKey: ['userAddresses', session?.user?.nickname],
    queryFn: async () => {
      const response = await userAddressApi.getMyAddressList();

      if (response.success && response.data) {
        // UserAddressWithAddressInfo를 UserAddress 형식으로 변환
        const convertedAddresses: UserAddress[] = response.data.map((item) => {
          // 좌표가 같은 값으로 저장된 경우 (잘못된 데이터) 처리
          let x = item.address.longitude || 0;
          let y = item.address.latitude || 0;

          // x와 y가 같은 값이면 잘못된 데이터로 간주
          if (x === y && x !== 0) {
            // 기본값으로 설정 (서울 시청)
            x = 126.978;
            y = 37.5665;
          }

          // 완전한 주소 생성 (동/호 포함)
          const dongPart = item.address.dong ? ` ${item.address.dong}동` : '';
          const hoPart = item.address.ho ? ` ${item.address.ho}호` : '';
          const completeAddress = item.address.roadAddress
            ? `${item.address.roadAddress}${dongPart}${hoPart}`
            : `${item.address.lotAddress}${dongPart}${hoPart}`;

          const convertedAddress = {
            id: item.id,
            nickname: item.nickname || item.address.lotAddress,
            x: x,
            y: y,
            isPrimary: item.isPrimary,
            legalDistrictCode: item.address.legalDistrictCode,
            lotAddress: item.address.lotAddress,
            roadAddress: item.address.roadAddress || '',
            completeAddress: completeAddress,
            dong: item.address.dong || '', // 동 정보 직접 매핑
            ho: item.address.ho || '', // 호 정보 직접 매핑
          };

          return convertedAddress;
        });

        return convertedAddresses;
      }

      return [];
    },
    enabled: status === 'authenticated' && !!session?.user?.nickname,
    staleTime: Infinity, // 수동으로 무효화할 때까지 fresh 상태 유지
    gcTime: 30 * 60 * 1000, // 30분간 메모리 유지
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 refetch 방지 (캐시가 있으면)
  });

  // React Query에서 받은 데이터를 Zustand store에 동기화
  useEffect(() => {
    if (userAddressesData && userAddressesData.length > 0) {
      memoizedInitializeFromQuery(userAddressesData);
    }
  }, [userAddressesData, memoizedInitializeFromQuery]);

  return {
    isLoading: isLoading || status === 'loading',
    error,
    fetchUserAddresses,
    isAuthenticated: status === 'authenticated',
  };
};
