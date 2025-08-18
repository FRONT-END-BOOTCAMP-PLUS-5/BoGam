import { frontendAxiosInstance } from './axiosInstance';

// Places API 응답 타입 정의
export interface PlaceSearchResponse {
  name: string; // 장소명
  address: string; // 주소
  longitude: string; // 경도
  latitude: string; // 위도
}

// 새로운 응답 타입들
export interface CoordinateResponseDto {
  x: number;
  y: number;
}

export interface AddressResponseDto {
  address: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Places API 클래스
 */
class PlacesApi {
  private static instance: PlacesApi;

  private constructor() {}

  public static getInstance(): PlacesApi {
    if (!PlacesApi.instance) {
      PlacesApi.instance = new PlacesApi();
    }
    return PlacesApi.instance;
  }

  /**
   * 장소 검색 (keyword + address 통합)
   */
  public async searchPlaces(query: string): Promise<PlaceSearchResponse[]> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<PlaceSearchResponse[]>(
      `/api/places?query=${encodeURIComponent(query)}`
    );

    return response.data;
  }

  /**
   * 키워드 검색 (건물명, 장소명 등)
   */
  public async searchByKeyword(query: string): Promise<PlaceSearchResponse[]> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<PlaceSearchResponse[]>(
      `/api/places/keyword?query=${encodeURIComponent(query)}`
    );

    return response.data;
  }

  /**
   * 좌표를 주소로 변환
   */
  public async coord2Address(
    x: number | string,
    y: number | string
  ): Promise<ApiResponse<AddressResponseDto>> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<ApiResponse<AddressResponseDto>>(
      `/api/places/coord2address?x=${x}&y=${y}`
    );

    return response.data;
  }

  /**
   * 주소를 좌표로 변환
   */
  public async address2Coord(
    query: string
  ): Promise<ApiResponse<CoordinateResponseDto>> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<
      ApiResponse<CoordinateResponseDto>
    >(`/api/places/address2coord?query=${encodeURIComponent(query)}`);

    return response.data;
  }
}

export const placesApi = PlacesApi.getInstance();
export default placesApi;
