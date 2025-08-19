import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { userAddressApi } from '@libs/api_front/userAddress.api';

interface UserAddressStore {
  // 상태
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  isLoading: boolean;
  error: string | null;

  // 초기화 (React Query에서 받은 데이터로)
  initializeFromQuery: (data: UserAddress[]) => void;

  // Optimistic Updates
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  selectAddress: (address: UserAddress) => void;
  clearSelectedAddress: () => void; // 추가

  // 에러 처리
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUserAddressStore = create<UserAddressStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        userAddresses: [],
        selectedAddress: null,
        isLoading: false,
        error: null,

        // React Query에서 받은 데이터로 초기화
        initializeFromQuery: (data) => {
          set({ userAddresses: data }, false, 'initializeFromQuery');

          // 대표 주소 자동 선택
          const primaryAddress = data.find((addr) => addr.isPrimary);
          if (primaryAddress) {
            set({ selectedAddress: primaryAddress }, false, 'setPrimaryAddress');
          }
        },

        // Optimistic Update로 주소 추가
        addAddress: async (newAddressData: Omit<UserAddress, 'id'>) => {
          const tempId = Date.now(); // 임시 ID
          const newAddress: UserAddress = {
            ...newAddressData,
            id: tempId,
          };

          // 즉시 UI 업데이트
          set((state) => ({
            userAddresses: [...state.userAddresses, newAddress],
          }), false, 'addAddress');

          try {
            // 서버에 저장
            const response = await userAddressApi.addAddress({
              addressNickname: newAddress.nickname,
              latitude: newAddress.y,
              longitude: newAddress.x,
              legalDistrictCode: newAddress.legalDistrictCode || '',
              dong: newAddress.dong || '', // 직접 사용
              ho: newAddress.ho || '', // 직접 사용
              lotAddress: newAddress.lotAddress,
              roadAddress: newAddress.roadAddress,
            });

            if (response.success) {
              console.log('✅ 주소 추가 성공');
              // 서버에서 받은 실제 ID로 업데이트
              const newId = (response.data as { id?: number })?.id;
              set((state) => ({
                userAddresses: state.userAddresses.map((addr) =>
                  addr.id === tempId
                    ? { ...addr, id: newId || tempId }
                    : addr
                ),
              }), false, 'updateAddressId');
            } else {
              throw new Error(response.message || '주소 추가 실패');
            }
          } catch (error) {
            console.error('❌ 주소 추가 실패:', error);
            // 롤백
            set((state) => ({
              userAddresses: state.userAddresses.filter((addr) => addr.id !== tempId),
            }), false, 'rollbackAddAddress');
            set({ error: error instanceof Error ? error.message : '주소 추가 실패' }, false, 'setError');
            throw error;
          }
        },

        // Optimistic Update로 주소 삭제
        deleteAddress: async (id) => {
          const addressToDelete = get().userAddresses.find((addr) => addr.id === id);

          // 즉시 UI에서 제거
          set((state) => ({
            userAddresses: state.userAddresses.filter((addr) => addr.id !== id),
            // 삭제된 주소가 선택된 주소였다면 선택 해제
            selectedAddress:
              state.selectedAddress?.id === id ? null : state.selectedAddress,
          }), false, 'deleteAddress');

          console.log('🗑️ 주소 삭제 (Optimistic):', id);

          try {
            // 서버에서 삭제
            await userAddressApi.deleteAddress(id);
            console.log('✅ 주소 삭제 성공');
          } catch (error) {
            console.error('❌ 주소 삭제 실패:', error);
            // 롤백
            if (addressToDelete) {
              set((state) => ({
                userAddresses: [...state.userAddresses, addressToDelete],
                selectedAddress: state.selectedAddress || addressToDelete,
              }), false, 'rollbackDeleteAddress');
            }
            set({ error: error instanceof Error ? error.message : '주소 삭제 실패' }, false, 'setError');
            throw error;
          }
        },

        // Optimistic Update로 즐겨찾기 토글
        toggleFavorite: async (id) => {
          // 즉시 UI 업데이트
          set((state) => {
            const targetAddress = state.userAddresses.find((addr) => addr.id === id);
            const isCurrentlyPrimary = targetAddress?.isPrimary || false;

            // 대표 주소를 변경하는 경우 (현재 대표 주소가 아닌 주소를 대표로 설정)
            if (!isCurrentlyPrimary) {
              return {
                userAddresses: state.userAddresses.map((addr) => ({
                  ...addr,
                  isPrimary: addr.id === id, // 클릭된 주소만 true, 나머지는 false
                })),
              };
            } else {
              // 대표 주소 해제하는 경우 (현재 대표 주소를 해제)
              return {
                userAddresses: state.userAddresses.map((addr) =>
                  addr.id === id ? { ...addr, isPrimary: false } : addr
                ),
              };
            }
          }, false, 'toggleFavorite');

          console.log('⭐ 즐겨찾기 토글 (Optimistic):', id);

          try {
            // 서버에 저장 (API 구현 필요)
            // const response = await userAddressApi.toggleFavorite(id);
            console.log('✅ 즐겨찾기 토글 성공');
          } catch (error) {
            console.error('❌ 즐겨찾기 토글 실패:', error);
            // 롤백
            set((state) => ({
              userAddresses: state.userAddresses.map((addr) =>
                addr.id === id ? { ...addr, isPrimary: !addr.isPrimary } : addr
              ),
            }), false, 'rollbackToggleFavorite');
            set({
              error: error instanceof Error ? error.message : '즐겨찾기 토글 실패',
            }, false, 'setError');
            throw error;
          }
        },

        // 즉시 업데이트 (서버 통신 없음)
        selectAddress: (address) => {
          set({ selectedAddress: address }, false, 'selectAddress');
          console.log('📍 주소 선택:', address);
        },

        // 선택된 주소 초기화
        clearSelectedAddress: () => {
          set({ selectedAddress: null }, false, 'clearSelectedAddress');
          console.log('🔄 선택된 주소 초기화');
        },

        // 에러 처리
        setError: (error) => set({ error }, false, 'setError'),
        clearError: () => set({ error: null }, false, 'clearError'),
      }),
      {
        name: 'user-address-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
