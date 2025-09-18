import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { userAddressApi } from '@libs/api_front/userAddress.api';
import { addressUtils } from '@utils/userAddressUtils';

// 타입 정의
type AddressWithoutId = Omit<UserAddress, 'id'>;
type StoreState = {
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  isLoading: boolean;
  error: string | null;
  dong: string;
  ho: string;
  isNewAddressSearch: boolean;
};

// 액션 그룹 정의
type AddressActions = {
  // 주소 관리
  addAddress: (address: AddressWithoutId) => Promise<void>;
  addVolatileAddress: (address: UserAddress) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  deleteVolatileAddress: (id: number) => void;
  selectAddress: (address: UserAddress) => void;
  clearSelectedAddress: () => void;
  toggleFavorite: (id: number) => Promise<void>;
};

type StateActions = {
  // 상태 관리
  setDong: (dong: string) => void;
  setHo: (ho: string) => void;
  setIsNewAddressSearch: (isNew: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearAll: () => void;
};

type UtilityActions = {
  // 유틸리티 함수
  initializeFromQuery: (data: UserAddress[]) => void;
  getPersistentAddresses: () => UserAddress[];
  getPersistentSelectedAddress: () => UserAddress | null;
};

// 통합 인터페이스
interface UserAddressStore
  extends StoreState,
    AddressActions,
    StateActions,
    UtilityActions {}

// 상수 정의
const STORE_CONFIG = {
  name: 'user-address-store',
  staleTime: 5 * 60 * 1000, // 5분
  retryCount: 2,
} as const;

// 초기 상태 정의
const initialState: StoreState = {
  userAddresses: [],
  selectedAddress: null,
  isLoading: false,
  error: null,
  dong: '',
  ho: '',
  isNewAddressSearch: false,
};

export const useUserAddressStore = create<UserAddressStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      ...initialState,

      // React Query에서 받은 데이터로 초기화
      initializeFromQuery: (data) => {
        const currentState = get();

        // 기존 휘발성 주소들 보존
        const volatileAddresses = addressUtils.filterVolatileAddresses(
          currentState.userAddresses
        );
        const mergedAddresses = [...data, ...volatileAddresses];

        // 리팩토링된 유틸리티 함수로 선택된 주소 결정
        const selectedAddress = addressUtils.determineSelectedAddress(
          currentState.selectedAddress,
          data
        );

        // 상태 보존 로직
        const hasVolatileAddress = volatileAddresses.length > 0;
        const preserveIsNewAddressSearch =
          hasVolatileAddress && currentState.isNewAddressSearch;

        // 상태 업데이트
        set(
          () => ({
            userAddresses: mergedAddresses,
            selectedAddress,
            isNewAddressSearch: preserveIsNewAddressSearch,
          }),
          false,
          'initializeFromQuery'
        );
      },

      // 휘발성 주소 추가 (DB 저장 없음)
      addVolatileAddress: (newAddress: UserAddress) => {
        set(
          (state) => {
            // 리팩토링된 유틸리티 함수로 새 상태 생성
            const newState = addressUtils.createVolatileAddressState(
              state,
              newAddress
            );

            return newState;
          },
          false,
          'addVolatileAddress'
        );

        return Promise.resolve();
      },

      // 휘발성 주소 삭제 (DB 저장 없음)
      deleteVolatileAddress: (id: number) => {
        set(
          (state) => ({
            userAddresses: state.userAddresses.filter((addr) => addr.id !== id),
            selectedAddress:
              state.selectedAddress?.id === id ? null : state.selectedAddress,
          }),
          false,
          'deleteVolatileAddress'
        );
      },

      // Optimistic Update로 주소 추가
      addAddress: async (newAddressData: AddressWithoutId) => {
        const tempId = Date.now();
        const newAddress: UserAddress = { ...newAddressData, id: tempId };

        // 즉시 UI 업데이트
        set(
          (state) => ({
            userAddresses: [...state.userAddresses, newAddress],
          }),
          false,
          'addAddress'
        );

        try {
          const apiRequestData = addressUtils.createApiRequestData(newAddress);
          const response = await userAddressApi.addAddress(apiRequestData);

          if (response.success) {
            const newId = (response.data as { id?: number })?.id;
            set(
              (state) => ({
                userAddresses: state.userAddresses.map((addr) =>
                  addr.id === tempId ? { ...addr, id: newId || tempId } : addr
                ),
              }),
              false,
              'updateAddressId'
            );
          } else {
            throw new Error(response.message || '주소 추가 실패');
          }
        } catch (error) {
          // 롤백
          set(
            (state) => ({
              userAddresses: state.userAddresses.filter(
                (addr) => addr.id !== tempId
              ),
              error: error instanceof Error ? error.message : '주소 추가 실패',
            }),
            false,
            'rollbackAddAddress'
          );
          throw error;
        }
      },

      // Optimistic Update로 주소 삭제
      deleteAddress: async (id) => {
        const addressToDelete = get().userAddresses.find(
          (addr) => addr.id === id
        );

        // 즉시 UI에서 제거
        set(
          (state) => ({
            userAddresses: state.userAddresses.filter((addr) => addr.id !== id),
            selectedAddress:
              state.selectedAddress?.id === id ? null : state.selectedAddress,
          }),
          false,
          'deleteAddress'
        );

        try {
          await userAddressApi.deleteAddress(id);
        } catch (error) {
          // 롤백
          if (addressToDelete) {
            set(
              (state) => ({
                userAddresses: [...state.userAddresses, addressToDelete],
                selectedAddress: state.selectedAddress || addressToDelete,
                error:
                  error instanceof Error ? error.message : '주소 삭제 실패',
              }),
              false,
              'rollbackDeleteAddress'
            );
          }
          throw error;
        }
      },

      // Optimistic Update로 즐겨찾기 토글
      toggleFavorite: async (id) => {
        const currentState = get();
        const targetAddress = currentState.userAddresses.find(
          (addr) => addr.id === id
        );

        if (!targetAddress) {
          throw new Error('주소를 찾을 수 없습니다.');
        }

        const newPrimaryState = !targetAddress.isPrimary;

        // 즉시 UI 업데이트
        set(
          (state) => ({
            userAddresses: state.userAddresses.map((addr) =>
              addr.id === id ? { ...addr, isPrimary: newPrimaryState } : addr
            ),
          }),
          false,
          'toggleFavorite'
        );

        try {
          const response = await fetch('/api/user-address/toggle-primary', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddressId: id }),
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || '즐겨찾기 토글 실패');
          }
        } catch (error) {
          // 롤백
          set(
            (state) => ({
              userAddresses: state.userAddresses.map((addr) =>
                addr.id === id ? { ...addr, isPrimary: !newPrimaryState } : addr
              ),
              error:
                error instanceof Error ? error.message : '즐겨찾기 토글 실패',
            }),
            false,
            'rollbackToggleFavorite'
          );
          throw error;
        }
      },

      // 즉시 업데이트 (서버 통신 없음)
      selectAddress: (address) => {
        set({ selectedAddress: address }, false, 'selectAddress');
      },

      clearSelectedAddress: () => {
        set({ selectedAddress: null }, false, 'clearSelectedAddress');
      },

      // 상태 관리 함수들
      setDong: (dong) => set({ dong }, false, 'setDong'),
      setHo: (ho) => set({ ho }, false, 'setHo'),
      setIsNewAddressSearch: (isNew) =>
        set({ isNewAddressSearch: isNew }, false, 'setIsNewAddressSearch'),
      setError: (error) => set({ error }, false, 'setError'),
      clearError: () => set({ error: null }, false, 'clearError'),

      // 전체 상태 초기화
      clearAll: () => {
        set(initialState, false, 'clearAll');
      },

      // 유틸리티 함수들
      getPersistentAddresses: () =>
        addressUtils.filterPersistentAddresses(get().userAddresses),
      getPersistentSelectedAddress: () => {
        const current = get();
        return current.selectedAddress && !current.selectedAddress.isVolatile
          ? current.selectedAddress
          : null;
      },
    }),
    { name: STORE_CONFIG.name }
  )
);
