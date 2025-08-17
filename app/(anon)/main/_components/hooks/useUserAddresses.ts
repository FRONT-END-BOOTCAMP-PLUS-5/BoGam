import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { userAddressApi } from '@libs/api_front';

export const useUserAddresses = (
  setUserAddresses: (addresses: UserAddress[]) => void,
  setSelectedAddress: (address: UserAddress | null) => void,
  setMapCenter: (center: { lat: number; lng: number }) => void
) => {
  const { data: session } = useSession();

  // 사용자 주소 목록 가져오기
  const fetchUserAddresses = useCallback(async () => {
    try {
      const data = await userAddressApi.getMyAddressList();
      setUserAddresses(data);

      // 기본 주소 찾기
      const primaryAddress = data.find((addr: UserAddress) => addr.isPrimary);
      if (primaryAddress) {
        setSelectedAddress(primaryAddress);
        setMapCenter({ lat: primaryAddress.y, lng: primaryAddress.x });
      }
    } catch (error) {
      console.error('사용자 주소 가져오기 실패:', error);
    }
  }, [setUserAddresses, setSelectedAddress, setMapCenter]);

  // 사용자 주소 목록 초기화
  useEffect(() => {
    if (session?.user) {
      fetchUserAddresses();
    }
  }, [session, fetchUserAddresses]);

  return {
    fetchUserAddresses,
  };
};
