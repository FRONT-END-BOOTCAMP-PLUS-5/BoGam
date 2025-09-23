import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useTransactionDetail } from './useTransactionDetail';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import {
  createApartmentParams,
  createSingleParams,
  validateTransactionSearch,
} from '@utils/main/transactionUtils';

export const useTransactionManagement = () => {
  // 실거래가 데이터 Store
  const {
    transactionData,
    clearTransactionData,
    isLoading,
  } = useTransactionDataStore();

  // 실거래가 상세 데이터 관리
  const { fetchTransactionDetailApartMutation, fetchTransactionDetailSingleMutation } =
    useTransactionDetail();

  // Store에서 선택된 주소 가져오기
  const { selectedAddress } = useUserAddressStore();

  // 메인 페이지 상태
  const { selectedYear } = useMainPageState();

  // 실거래가 데이터 조회 함수
  const handleMoveToAddress = async (
    buildingType: string,
    complexName?: string
  ) => {
    if (!selectedAddress) {
      console.error('선택된 주소가 없습니다.');
      return;
    }

    // 입력값 검증
    const validation = validateTransactionSearch(
      selectedAddress,
      buildingType,
      complexName || ''
    );

    if (!validation.isValid) {
      console.error(validation.error || '입력값이 올바르지 않습니다.');
      return;
    }

    try {
      // 기존 데이터 초기화
      clearTransactionData();

      if (buildingType === '0' && complexName) {
        // 아파트 계열 조회
        const params = createApartmentParams(buildingType, complexName);
        await fetchTransactionDetailApartMutation.mutateAsync({
          ...params,
          contractYear: selectedYear,
        });
      } else {
        // 단독/연립 조회
        const params = createSingleParams(buildingType, selectedAddress);
        await fetchTransactionDetailSingleMutation.mutateAsync({
          ...params,
          contractYear: selectedYear,
        });
      }
    } catch (error) {
      console.error('실거래가 조회 실패:', error);
    }
  };

  return {
    transactionData,
    isLoading,
    handleMoveToAddress,
    clearTransactionData,
  };
};