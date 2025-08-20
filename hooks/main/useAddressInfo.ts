import { useState, useCallback, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface AddressInfo {
  address: {
    address_name: string; // 전체 주소
    region_1depth_name: string; // 시/도
    region_2depth_name: string; // 구/군
    region_3depth_name: string; // 동/읍/면
    region_3depth_h_name: string; // 행정동명
    h_code: string; // 법정동코드 (행정동)
    b_code: string; // 법정동코드 (법정동)
    mountain_yn: string; // 산 여부
    main_address_no: string; // 지번 주번지
    sub_address_no: string; // 지번 부번지
    zip_code: string; // 우편번호
    x: string; // X 좌표
    y: string; // Y 좌표
  };
  road_address?: {
    address_name: string; // 도로명 주소
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string; // 도로명
    underground_yn: string; // 지하 여부
    main_building_no: string; // 건물 본번
    sub_building_no: string; // 건물 부번
    building_name: string; // 건물명
    zone_no: string; // 우편번호
    x: string;
    y: string;
  };
}

interface UseAddressInfoState {
  addressInfo: AddressInfo | null;
  loading: boolean;
  error: string | null;
}

export const useAddressInfo = () => {
  const [state, setState] = useState<UseAddressInfoState>({
    addressInfo: null,
    loading: false,
    error: null,
  });

  // ref를 사용하여 로딩 상태 추적 (의존성 배열 문제 해결)
  const isLoadingRef = useRef(false);

  const getAddressInfo = useCallback(async (location: Location) => {
    // 이미 로딩 중이면 중복 요청 방지
    if (isLoadingRef.current) {
      return null;
    }
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    if (!apiKey) {
      setState((prev) => ({
        ...prev,
        error: '카카오 REST API 키가 설정되지 않았습니다.',
      }));
      return null;
    }

    // 로딩 상태 설정
    isLoadingRef.current = true;
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location.lng}&y=${location.lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();

      if (data.documents && data.documents.length > 0) {
        const addressInfo = data.documents[0];
        setState({
          addressInfo,
          loading: false,
          error: null,
        });
        isLoadingRef.current = false; // 로딩 완료
        return addressInfo;
      } else {
        throw new Error('주소 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      setState({
        addressInfo: null,
        loading: false,
        error: errorMessage,
      });
      isLoadingRef.current = false; // 로딩 완료 (에러 시에도)
      return null;
    }
  }, []);

  const clearAddressInfo = useCallback(() => {
    isLoadingRef.current = false; // 로딩 상태도 초기화
    setState({
      addressInfo: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    getAddressInfo,
    clearAddressInfo,
  };
};
