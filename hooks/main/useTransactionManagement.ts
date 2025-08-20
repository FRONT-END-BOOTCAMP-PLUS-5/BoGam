import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useTransactionDetail } from './useTransactionDetail';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import {
  createApartmentParams,
  createSingleParams,
  validateTransactionSearch,
} from '@utils/main/transactionUtils';

export const useTransactionManagement = () => {
  // 실거래가 데이터 Store
  const {
    transactionData,
    setTransactionData,
    clearTransactionData,
    isLoading,
  } = useTransactionDataStore();

  // 실거래가 상세 데이터 관리
  const { fetchTransactionDetailApart, fetchTransactionDetailSingle } =
    useTransactionDetail();

  // Store에서 선택된 주소 가져오기
  const { selectedAddress } = useUserAddressStore();

  // 실거래가 데이터 조회
  const handleTransactionSearch = async (
    buildingType: string,
    complexName: string
  ) => {
    // 유효성 검사
    const validation = validateTransactionSearch(
      selectedAddress,
      buildingType,
      complexName
    );
    if (!validation.isValid) {
      console.warn(validation.error);
      return;
    }

    try {
      // 실거래가 데이터 초기화
      clearTransactionData();

      // 건물 타입에 따른 API 호출
      switch (buildingType) {
        case '0': // 아파트
          const apartmentParams = createApartmentParams(
            buildingType,
            complexName
          );
          await fetchTransactionDetailApart(apartmentParams);
          break;
        case '1': // 연립/다세대
        case '2': // 오피스텔
          const singleParams = createSingleParams(
            buildingType,
            selectedAddress!
          );
          await fetchTransactionDetailSingle(singleParams);
          break;
        default:
          console.warn('지원하지 않는 건물 타입입니다.');
          return;
      }

      console.log('실거래가 데이터 조회 완료');
    } catch (error) {
      console.error('실거래가 데이터 조회 실패:', error);
    }
  };

  // 실거래가 데이터 초기화
  const handleClearTransactionData = () => {
    clearTransactionData();
    console.log('실거래가 데이터가 초기화되었습니다.');
  };

  return {
    // 상태
    transactionData,
    isLoading,

    // 핸들러
    handleTransactionSearch,
    handleClearTransactionData,

    // 기타
    setTransactionData,
    clearTransactionData,
    fetchTransactionDetailApart,
    fetchTransactionDetailSingle,
  };
};
