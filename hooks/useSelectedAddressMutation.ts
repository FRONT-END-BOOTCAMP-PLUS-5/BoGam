import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { selectedAddressApi } from '@libs/api_front/selectedAddress.api';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export const useSelectedAddressMutation = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { userAddresses, selectAddress } = useUserAddressStore();

  return useMutation({
    mutationFn: async (addressId: number) => {
      if (!session?.user?.nickname) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      return await selectedAddressApi.updateSelectedAddress({
        userNickname: session.user.nickname,
        addressId,
      });
    },

    // 낙관적 업데이트: API 호출 전에 UI를 먼저 업데이트
    onMutate: async (addressId: number) => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트가 덮어쓰이지 않도록 함
      await queryClient.cancelQueries({
        queryKey: ['userAddresses', session?.user?.nickname],
      });

      // 이전 데이터를 백업 (롤백용)
      const previousAddresses = queryClient.getQueryData([
        'userAddresses',
        session?.user?.nickname,
      ]);
      const previousSelectedAddress = userAddresses.find(
        (addr) => addr.isSelected
      );

      // 낙관적으로 UI 업데이트
      const newAddresses = userAddresses.map((addr) => ({
        ...addr,
        isSelected: addr.id === addressId,
      }));

      // React Query 캐시 업데이트
      queryClient.setQueryData(
        ['userAddresses', session?.user?.nickname],
        newAddresses
      );

      // Zustand store도 즉시 업데이트
      const selectedAddress = userAddresses.find(
        (addr) => addr.id === addressId
      );
      if (selectedAddress) {
        selectAddress(selectedAddress);
      }

      // 롤백을 위해 이전 데이터 반환
      return { previousAddresses, previousSelectedAddress };
    },

    // 에러 시: 이전 상태로 롤백
    onError: (error, addressId, context) => {
      console.error('❌ 주소 선택 상태 업데이트 실패:', error);

      // 이전 데이터로 롤백
      if (context?.previousAddresses) {
        queryClient.setQueryData(
          ['userAddresses', session?.user?.nickname],
          context.previousAddresses
        );
      }

      // Zustand store도 이전 상태로 롤백
      if (context?.previousSelectedAddress) {
        selectAddress(context.previousSelectedAddress);
      }
    },
  });
};
