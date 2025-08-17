import { useCallback } from 'react';
import { Location } from '@/(anon)/main/_components/types/map.types';
import { DaumPostcodeData } from '@/(anon)/main/_components/types/mainPage.types';
import { placesApi } from '@libs/api_front';

export const useAddressSearch = (
  setMapCenter: (center: Location) => void,
  setSearchLocationMarker: (marker: Location | null) => void,
  setFullAddress: (address: string) => void
) => {
  // 주소를 좌표로 변환하는 함수
  const addressToCoordinates = useCallback(
    async (address: string): Promise<Location | null> => {
      try {
        const data = await placesApi.address2Coord(address);
        if (data.documents && data.documents.length > 0) {
          return {
            lat: parseFloat(data.documents[0].y),
            lng: parseFloat(data.documents[0].x),
          };
        }
        return null;
      } catch (error) {
        console.error('주소 좌표 변환 실패:', error);
        return null;
      }
    },
    []
  );

  // 주소 검색 및 지도 이동
  const moveToAddress = useCallback(
    async (
      detailAddress: string,
      dong: string,
      ho: string,
      savedLawdCode: string,
      onTransactionDataFetch: () => Promise<void>
    ) => {
      if (!detailAddress || !dong.trim()) {
        alert('상세 주소와 동을 입력해주세요.');
        return;
      }

      // 호는 옵션으로 처리
      const hoPart = ho.trim() ? ` ${ho.trim()}호` : '';
      const completeAddress = `${detailAddress} ${dong.trim()}동${hoPart}`;
      setFullAddress(completeAddress);

      try {
        // 키워드 검색으로 지도 이동 (건물명, 장소명 등)
        const searchData = await placesApi.searchByKeyword(completeAddress);
        console.log('키워드 검색 API 응답:', searchData);
        if (searchData && searchData.length > 0) {
          const location = {
            lat: parseFloat(searchData[0].latitude),
            lng: parseFloat(searchData[0].longitude),
          };
          console.log('검색된 좌표:', location);
          setMapCenter(location);
          setSearchLocationMarker(location);
          // 실거래가 데이터는 Daum 우체국 주소 API에서 받은 법정동코드 사용
          await onTransactionDataFetch();
        } else {
          alert('해당 주소를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('키워드 검색 실패:', error);
        alert('키워드 검색 중 오류가 발생했습니다.');
      }
    },
    [setMapCenter, setSearchLocationMarker, setFullAddress]
  );

  // Daum Postcode 결과 처리
  const handleDaumPostcodeResult = useCallback(
    (
      data: DaumPostcodeData,
      setDetailAddress: (address: string) => void,
      setSavedLawdCode: (code: string) => void,
      setDong: (dong: string) => void,
      setHo: (ho: string) => void,
      setFullAddress: (address: string) => void,
      setSearchQuery: (query: string) => void,
      setShowPostcode: (show: boolean) => void
    ) => {
      const baseAddress =
        data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
      const lawdCode = data.bcode.substring(0, 5);
      const displayAddress =
        data.userSelectedType === 'R'
          ? `${data.roadAddress} (도로명주소)`
          : `${data.jibunAddress} (지번주소)`;

      setDetailAddress(baseAddress);
      setSavedLawdCode(lawdCode);
      setDong('');
      setHo('');
      setFullAddress('');
      setSearchQuery(displayAddress);
      setShowPostcode(false);
    },
    []
  );

  return {
    addressToCoordinates,
    moveToAddress,
    handleDaumPostcodeResult,
  };
};
