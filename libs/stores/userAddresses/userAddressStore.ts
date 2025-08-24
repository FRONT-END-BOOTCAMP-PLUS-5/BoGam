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

  // 동/호 상태 (탭 간 유지)
  dong: string;
  ho: string;

  // 초기화 (React Query에서 받은 데이터로)
  initializeFromQuery: (data: UserAddress[]) => void;

  // Optimistic Updates
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  addVolatileAddress: (address: UserAddress) => void; // 휘발성 주소 추가 (DB 저장 없음)
  deleteAddress: (id: number) => Promise<void>;
  deleteVolatileAddress: (id: number) => void; // 휘발성 주소 삭제 (DB 저장 없음)
  toggleFavorite: (id: number) => Promise<void>;
  selectAddress: (address: UserAddress) => void;
  clearSelectedAddress: () => void; // 추가

  // 동/호 상태 관리
  setDong: (dong: string) => void;
  setHo: (ho: string) => void;

  // 전체 상태 초기화 (로그아웃/세션만료)
  clearAll: () => void;

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
        dong: '',
        ho: '',

        // React Query에서 받은 데이터로 초기화
        initializeFromQuery: (data) => {
          const currentState = get();

          // console.log('🔄 initializeFromQuery 호출:', {
          //   dataLength: data.length,
          //   currentUserAddressesLength: currentState.userAddresses.length,
          //   currentSelectedAddress: currentState.selectedAddress?.nickname,
          //   volatileAddressesCount: currentState.userAddresses.filter(
          //     (addr) => addr.isVolatile
          //   ).length,
          // });

          // 기존 휘발성 주소들 보존
          const volatileAddresses = currentState.userAddresses.filter(
            (addr) => addr.isVolatile
          );

          // console.log(
          //   '💾 휘발성 주소 보존:',
          //   volatileAddresses.map((addr) => addr.nickname)
          // );

          // DB 데이터와 휘발성 주소를 합침
          const mergedAddresses = [...data, ...volatileAddresses];

          // console.log(
          //   '🔗 병합된 주소 목록:',
          //   mergedAddresses.map(
          //     (addr) => `${addr.nickname}${addr.isVolatile ? ' (휘발성)' : ''}`
          //   )
          // );

          // selectedAddress를 보존하면서 userAddresses만 업데이트
          set(
            (state) => ({
              userAddresses: mergedAddresses,
              // selectedAddress는 기존 상태 유지
            }),
            false,
            'initializeFromQuery'
          );

          // 이미 선택된 주소가 있으면 그대로 유지, 없으면 대표 주소 선택
          if (!currentState.selectedAddress) {
            const primaryAddress = data.find((addr) => addr.isPrimary);
            if (primaryAddress) {
              // console.log('⭐ 대표 주소 선택:', primaryAddress.nickname);
              set(
                (state) => ({ selectedAddress: primaryAddress }),
                false,
                'setPrimaryAddress'
              );
            }
          } else {
            // console.log(
            //   '✅ 기존 선택된 주소 유지:',
            //   currentState.selectedAddress.nickname
            // );
          }
        },

        // 휘발성 주소 추가 (DB 저장 없음)
        addVolatileAddress: (newAddress: UserAddress) => {
          // console.log('🆕 휘발성 주소 추가 및 자동 선택:', newAddress.nickname);

          // 즉시 UI 업데이트 및 자동 선택
          set(
            (state) => {
              // 기존 휘발성 주소들 삭제
              const nonVolatileAddresses = state.userAddresses.filter(
                (addr) => !addr.isVolatile
              );

              return {
                userAddresses: [...nonVolatileAddresses, newAddress],
                selectedAddress: newAddress, // 새 주소를 자동으로 선택
              };
            },
            false,
            'addVolatileAddress'
          );
        },

        // 휘발성 주소 삭제 (DB 저장 없음)
        deleteVolatileAddress: (id: number) => {
          set(
            (state) => ({
              userAddresses: state.userAddresses.filter(
                (addr) => addr.id !== id
              ),
              selectedAddress:
                state.selectedAddress?.id === id ? null : state.selectedAddress,
            }),
            false,
            'deleteVolatileAddress'
          );
        },

        // Optimistic Update로 주소 추가
        addAddress: async (newAddressData: Omit<UserAddress, 'id'>) => {
          const tempId = Date.now(); // 임시 ID
          const newAddress: UserAddress = {
            ...newAddressData,
            id: tempId,
          };

          // 즉시 UI 업데이트
          set(
            (state) => ({
              userAddresses: [...state.userAddresses, newAddress],
            }),
            false,
            'addAddress'
          );

          try {
            // 서버에 저장
            // 주소 닉네임 포맷팅: 주소 + (동이 있으면) " xx동" + (호가 있으면) " xx호"
            const dongPart = newAddress.dong ? ` ${newAddress.dong}동` : '';
            const hoPart = newAddress.ho ? ` ${newAddress.ho}호` : '';
            const addressNickname = `${newAddress.roadAddress}${dongPart}${hoPart}`;

            const apiRequestData = {
              addressNickname,
              latitude: newAddress.y,
              longitude: newAddress.x,
              legalDistrictCode: newAddress.legalDistrictCode || '',
              dong: newAddress.dong || '', // 직접 사용
              ho: newAddress.ho || '', // 직접 사용
              lotAddress: newAddress.lotAddress,
              roadAddress: newAddress.roadAddress,
            };

            const response = await userAddressApi.addAddress(apiRequestData);

            if (response.success) {
              // 서버에서 받은 실제 ID로 업데이트
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
            // console.error('❌ 주소 추가 실패:', error);
            // 롤백
            set(
              (state) => ({
                userAddresses: state.userAddresses.filter(
                  (addr) => addr.id !== tempId
                ),
              }),
              false,
              'rollbackAddAddress'
            );
            set(
              {
                error:
                  error instanceof Error ? error.message : '주소 추가 실패',
              },
              false,
              'setError'
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
              userAddresses: state.userAddresses.filter(
                (addr) => addr.id !== id
              ),
              // 삭제된 주소가 선택된 주소였다면 선택 해제
              selectedAddress:
                state.selectedAddress?.id === id ? null : state.selectedAddress,
            }),
            false,
            'deleteAddress'
          );

          try {
            // 서버에서 삭제
            await userAddressApi.deleteAddress(id);
          } catch (error) {
            // 롤백
            if (addressToDelete) {
              set(
                (state) => ({
                  userAddresses: [...state.userAddresses, addressToDelete],
                  selectedAddress: state.selectedAddress || addressToDelete,
                }),
                false,
                'rollbackDeleteAddress'
              );
            }
            set(
              {
                error:
                  error instanceof Error ? error.message : '주소 삭제 실패',
              },
              false,
              'setError'
            );
            throw error;
          }
        },

        // Optimistic Update로 즐겨찾기 토글
        toggleFavorite: async (id) => {
          // 즉시 UI 업데이트
          set(
            (state) => {
              const targetAddress = state.userAddresses.find(
                (addr) => addr.id === id
              );
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
            },
            false,
            'toggleFavorite'
          );

          try {
            // 서버에 저장
            const response = await fetch('/api/user-address/toggle-primary', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
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
                  addr.id === id
                    ? { ...addr, isPrimary: !addr.isPrimary }
                    : addr
                ),
              }),
              false,
              'rollbackToggleFavorite'
            );
            set(
              {
                error:
                  error instanceof Error ? error.message : '즐겨찾기 토글 실패',
              },
              false,
              'setError'
            );
            throw error;
          }
        },

        // 즉시 업데이트 (서버 통신 없음)
        selectAddress: (address) => {
          set({ selectedAddress: address }, false, 'selectAddress');
        },

        // 선택된 주소 초기화
        clearSelectedAddress: () => {
          set({ selectedAddress: null }, false, 'clearSelectedAddress');
        },

        // 동/호 상태 관리
        setDong: (dong) => set({ dong }, false, 'setDong'),
        setHo: (ho) => set({ ho }, false, 'setHo'),

        // 전체 상태 초기화 (로그아웃/세션만료)
        clearAll: () => {
          set(
            {
              userAddresses: [],
              selectedAddress: null,
              isLoading: false,
              error: null,
            },
            false,
            'clearAll'
          );
          // console.log('🧹 user-address-store 초기화');
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
