import { useTransactionDataStore } from '@libs/stores/transactionData/transactionDataStore';
import { useTransactionDetail } from './useTransactionDetail';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageState } from './useMainPageState';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { parseAddress } from '@utils/addressParser';
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

  // 메인 페이지 상태
  const { selectedYear, buildingType } = useMainPageState();

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
    } catch (error) {
      console.error('실거래가 데이터 조회 실패:', error);
    }
  };

  // 실거래가 데이터 초기화
  const handleClearTransactionData = () => {
    clearTransactionData();
  };

  // 실거래가 조회 (새로운 API 사용)
  const handleMoveToAddress = (
    selectedType: string = '0',
    buildingCode?: string
  ) => {
    try {
      // 실거래가 조회 시작 시 기존 데이터 초기화
      clearTransactionData();

      // 주소 파싱
      const address = selectedAddress?.completeAddress || '';
      const parsedAddress = parseAddress(address);

      // 선택된 타입에 따라 API 타입 결정
      // 0: 아파트, 1: 연립/다세대, 2: 오피스텔
      const apiType = selectedType;

      // 건물 코드가 있고 아파트/연립/오피스텔인 경우 fetchTransactionDetailApart 사용
      if (
        buildingCode &&
        (apiType === '0' || apiType === '1' || apiType === '2')
      ) {
        fetchTransactionDetailApart({
          buildingCode,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      } else {
        // 건물 코드가 없거나 단독/다가구인 경우 fetchTransactionDetailSingle 사용
        fetchTransactionDetailSingle({
          addrSido: parsedAddress.addrSido,
          addrSigungu: parsedAddress.addrSigungu,
          addrDong: parsedAddress.addrDong,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      }
    } catch (error) {
      console.error('실거래가 조회 실패:', error);
      alert('실거래가 조회 중 오류가 발생했습니다.');
    }
  };

  // 건물 선택 시 호출되는 함수
  const handleBuildingSelect = async (
    buildingCode: string,
    buildingName: string
  ) => {
    try {
      // 실거래가 조회 시작 시 기존 데이터 초기화
      clearTransactionData();

      // buildingType을 API type으로 매핑
      const getApiType = (buildingType: string): string => {
        switch (buildingType) {
          case 'apartment':
            return '0'; // 아파트
          case 'villa':
            return '1'; // 연립/다세대
          case 'officetel':
            return '2'; // 오피스텔
          case 'detached':
            return '1'; // 단독/다가구는 연립/다세대로 분류
          case 'multi':
            return '1'; // 다세대는 연립/다세대로 분류
          default:
            return '0'; // 기본값은 아파트
        }
      };

      const apiType = getApiType(buildingType.type);

      // 건물 타입에 따라 적절한 API 호출
      if (buildingType.type === 'detached') {
        // 단독/다가구는 별도 API 사용
        // 주소 파싱
        const address = selectedAddress?.completeAddress || '';
        const parsedAddress = parseAddress(address);

        await fetchTransactionDetailSingle({
          addrSido: parsedAddress.addrSido,
          addrSigungu: parsedAddress.addrSigungu,
          addrDong: parsedAddress.addrDong,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      } else {
        // 아파트, 연립, 오피스텔 등은 buildingCode 사용
        await fetchTransactionDetailApart({
          buildingCode,
          type: apiType,
          contractYear: selectedYear,
          contractType: '0', // 전체
        });
      }
    } catch (error) {
      alert('실거래가 조회 중 오류가 발생했습니다.');
    }
  };

  return {
    // 상태
    transactionData,
    isLoading,

    // 핸들러
    handleTransactionSearch,
    handleClearTransactionData,
    handleMoveToAddress,
    handleBuildingSelect,

    // 기타
    setTransactionData,
    clearTransactionData,
    fetchTransactionDetailApart,
    fetchTransactionDetailSingle,
  };
};
