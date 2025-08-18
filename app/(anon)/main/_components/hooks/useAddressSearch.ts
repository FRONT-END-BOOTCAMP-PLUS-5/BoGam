import { useMutation } from '@tanstack/react-query';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { DaumPostcodeData } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front/places.api';
import { useMapStore } from '@libs/stores/map/mapStore';

export const useAddressSearch = () => {
  const { setMapCenter, setSearchLocationMarker } = useMapStore();

  // 주소를 좌표로 변환하는 함수
  const addressToCoordinatesMutation = useMutation({
    mutationFn: async (address: string): Promise<Location | null> => {
      const data = await placesApi.address2Coord(address);
      if (data.success && data.data) {
        return {
          lat: data.data.y,
          lng: data.data.x,
        };
      }
      return null;
    },
    onError: (error) => {
      console.error('주소 좌표 변환 실패:', error);
    },
  });

  // 주소 검색 및 지도 이동
  const moveToAddressMutation = useMutation({
    mutationFn: async ({
      roadAddress,
      dong,
      ho,
      latAddress,
      onTransactionDataFetch,
    }: {
      roadAddress: string;
      dong: string;
      ho: string;
      latAddress: string;
      onTransactionDataFetch: () => Promise<void>;
    }) => {
      if (!roadAddress || !dong.trim()) {
        throw new Error('상세 주소와 동을 입력해주세요.');
      }

      // 호는 옵션으로 처리
      const hoPart = ho.trim() ? ` ${ho.trim()}호` : '';
      const completeAddress = latAddress
        ? `${latAddress} ${dong.trim()}동${hoPart}`
        : `${roadAddress} ${dong.trim()}동${hoPart}`;

      // 키워드 검색으로 지도 이동 (건물명, 장소명 등)
      const searchData = await placesApi.searchByKeyword(completeAddress);

      if (searchData && searchData.length > 0) {
        const location = {
          lat: parseFloat(searchData[0].latitude),
          lng: parseFloat(searchData[0].longitude),
        };
        setMapCenter(location);
        setSearchLocationMarker(location);
        // 실거래가 데이터는 Daum 우체국 주소 API에서 받은 법정동코드 사용
        await onTransactionDataFetch();
        return location;
      } else {
        throw new Error('해당 주소를 찾을 수 없습니다.');
      }
    },
    onError: (error) => {
      console.error('키워드 검색 실패:', error);
      alert('키워드 검색 중 오류가 발생했습니다.');
    },
  });

  // Daum Postcode 결과 처리
  const handleDaumPostcodeResult = (
    data: DaumPostcodeData,
    setRoadAddress: (address: string) => void,
    setSavedLawdCode: (code: string) => void,
    setDong: (dong: string) => void,
    setHo: (ho: string) => void,
    setSearchQuery: (query: string) => void,
    setShowPostcode: (show: boolean) => void,
    setAddressSaveData: (data: {
      roadAddress: string;
      jibunAddress: string;
      legalDistrictCode: string;
    }) => void
  ) => {
    // 도로명 주소를 기본으로 사용
    const roadAddress = data.roadAddress || '';
    const lawdCode = data.bcode.substring(0, 5);
    const displayAddress = roadAddress
      ? `${roadAddress} (도로명주소)`
      : `${data.jibunAddress} (지번주소)`;

    setRoadAddress(roadAddress);
    setSavedLawdCode(lawdCode);

    setSearchQuery(displayAddress);
    setShowPostcode(false);

    // 주소 저장 데이터 설정
    const addressSaveData = {
      roadAddress: data.roadAddress || '',
      jibunAddress: data.jibunAddress || '',
      legalDistrictCode: lawdCode,
    };

    setAddressSaveData(addressSaveData);
  };

  return {
    addressToCoordinates: addressToCoordinatesMutation.mutate,
    moveToAddress: moveToAddressMutation.mutate,
    handleDaumPostcodeResult,
    isLoading:
      addressToCoordinatesMutation.isPending || moveToAddressMutation.isPending,
    error: addressToCoordinatesMutation.error || moveToAddressMutation.error,
  };
};
