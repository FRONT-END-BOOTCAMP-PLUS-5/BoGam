import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { userAddressApi } from '@libs/api_front/userAddress.api';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useUserAddresses = () => {
  const { data: session, status } = useSession();
  const { initializeFromQuery } = useUserAddressStore();
  const queryClient = useQueryClient();

  // 사용자 주소 데이터를 가져오는 query
  const userAddressesQuery = useQuery({
    queryKey: ['userAddresses', session?.user?.nickname],
    queryFn: async (): Promise<UserAddress[]> => {
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
            isSelected: item.isSelected,
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
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2,
  });

  // 쿼리 데이터가 변경될 때마다 store 업데이트
  useEffect(() => {
    if (userAddressesQuery.data && userAddressesQuery.data.length > 0) {
      initializeFromQuery(userAddressesQuery.data);
    }
  }, [userAddressesQuery.data, initializeFromQuery]);

  // 사용자 변경 시 이전 사용자의 캐시 무효화 및 sessionStorage 정리
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.nickname) {
      // 현재 사용자가 아닌 다른 사용자의 캐시된 주소 데이터 무효화
      queryClient.invalidateQueries({
        queryKey: ['userAddresses'],
        exact: false, // userAddresses로 시작하는 모든 쿼리 무효화
      });

      // sessionStorage에서 이전 사용자의 주소 데이터 정리
      try {
        const storedData = sessionStorage.getItem('user-address-store');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // 이전 사용자의 데이터인지 확인 (nickname이 다르면 정리)
          if (parsedData.state?.userAddresses?.length > 0) {
            sessionStorage.removeItem('user-address-store');
            console.log('🧹 이전 사용자의 주소 데이터 정리됨');
          }
        }
      } catch (error) {
        console.error('sessionStorage 정리 중 오류:', error);
      }
    }
  }, [session?.user?.nickname, status, queryClient]);

  return {
    isLoading: userAddressesQuery.isLoading || status === 'loading',
    error: userAddressesQuery.error,
    fetchUserAddresses: () => userAddressesQuery.refetch(),
    isAuthenticated: status === 'authenticated',
  };
};
