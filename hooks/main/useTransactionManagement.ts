import { useCallback } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useToastStore } from '@libs/stores/toastStore';
import {
  createApartmentParams,
  createSingleParams,
  validateTransactionSearch,
} from '../../utils/main/transactionUtils';

export const useTransactionManagement = () => {
  const { showError } = useToastStore();

  // Store에서 데이터 가져오기
  const { selectedAddress } = useUserAddressStore();
  const { selectedYear } = useMainPageState();
  const {
    transactionData,
    isLoading,
    fetchTransactionData,
    clearTransactionData,
  } = useTransactionDataStore();

  /**
   * 실거래가 조회 (주소와 건물 타입 기반)
   */
  const handleTransactionSearch = useCallback(
    async (buildingType: string, complexName: string) => {
      if (!selectedAddress) {
        showError('선택된 주소가 없습니다.');
        return;
      }

      // 유효성 검사
      const validation = validateTransactionSearch(
        selectedAddress,
        buildingType,
        complexName
      );
      if (!validation.isValid) {
        showError(validation.error || '검색 조건을 확인해주세요.');
        return;
      }

      try {
        let searchParams;

        if (buildingType === '0') {
          // 아파트 검색
          searchParams = createApartmentParams(buildingType, complexName);
        } else {
          // 단독/다가구 검색
          searchParams = createSingleParams(buildingType, selectedAddress);
        }

        // 계약년도 추가
        const finalParams = {
          ...searchParams,
          contractYear: selectedYear,
        };

        await fetchTransactionData(finalParams);
      } catch (error) {
        console.error('실거래가 조회 실패:', error);
        showError('실거래가 조회에 실패했습니다.');
      }
    },
    [selectedAddress, selectedYear, fetchTransactionData, showError]
  );

  /**
   * 지도 이동 (실거래가 조회 포함)
   */
  const handleMoveToAddress = useCallback(
    async (buildingType: string, complexName: string) => {
      await handleTransactionSearch(buildingType, complexName);
    },
    [handleTransactionSearch]
  );

  /**
   * 건물 선택 처리
   */
  const handleBuildingSelect = useCallback(
    (buildingType: string, complexName: string) => {
      handleTransactionSearch(buildingType, complexName);
    },
    [handleTransactionSearch]
  );

  /**
   * 실거래가 데이터 초기화
   */
  const handleClearTransactionData = useCallback(() => {
    clearTransactionData();
  }, [clearTransactionData]);

  return {
    // 상태
    transactionData,
    isLoading,

    // 액션
    handleTransactionSearch,
    handleMoveToAddress,
    handleBuildingSelect,
    handleClearTransactionData,
  };
};
