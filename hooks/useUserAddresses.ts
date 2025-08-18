import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { userAddressApi } from '@libs/api_front/userAddress.api';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useUserAddresses = () => {
  const { data: session, status } = useSession();
  const { initializeFromQuery } = useUserAddressStore();

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
            console.warn('잘못된 좌표 데이터 발견:', {
              x,
              y,
              address: item.address.lotAddress,
            });
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

          console.log('📍 주소 변환 결과:', {
            originalItem: item,
            convertedAddress: convertedAddress,
            dong: item.address.dong,
            ho: item.address.ho,
          });

          return convertedAddress;
        });

        console.log('✅ 변환된 주소 데이터:', convertedAddresses);
        return convertedAddresses;
      }

      console.log('❌ 주소 데이터 없음');
      return [];
    },
    enabled: status === 'authenticated' && !!session?.user?.nickname,
    staleTime: 0, // 즉시 stale로 처리하여 캐시 무효화 시 즉시 refetch
    gcTime: 10 * 60 * 1000, // 10분간 메모리 유지
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  // React Query에서 받은 데이터를 Zustand store에 동기화
  useEffect(() => {
    if (userAddressesData) {
      console.log('🔄 React Query 데이터를 Store에 동기화:', userAddressesData);
      initializeFromQuery(userAddressesData);
    }
  }, [userAddressesData, initializeFromQuery]);

  return {
    isLoading: isLoading || status === 'loading',
    error,
    fetchUserAddresses,
    isAuthenticated: status === 'authenticated',
  };
};
