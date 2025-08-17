import { frontendAxiosInstance } from './axiosInstance';

// Places API 응답 타입 정의
export interface PlaceSearchResponse {
  name: string; // 장소명
  address: string; // 주소
  longitude: string; // 경도
  latitude: string; // 위도
}

export interface Coord2AddressResponse {
  documents: Array<{
    address: {
      address_name: string;
      h_code: string;
      b_code: string;
      main_address_no: string;
      sub_address_no: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      region_3depth_h_name: string;
      x: string;
      y: string;
    };
    road_address: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      underground_yn: string;
      main_building_no: string;
      sub_building_no: string;
      building_name: string;
      zone_no: string;
      x: string;
      y: string;
    };
  }>;
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

export interface Address2CoordResponse {
  documents: Array<{
    address_name: string;
    address_type: string;
    x: string;
    y: string;
    address: {
      address_name: string;
      b_code: string;
      h_code: string;
      main_address_no: string;
      mountain_yn: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_h_name: string;
      region_3depth_name: string;
      sub_address_no: string;
      x: string;
      y: string;
    };
    road_address: {
      address_name: string;
      building_name: string;
      main_building_no: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
      road_name: string;
      sub_building_no: string;
      underground_yn: string;
      x: string;
      y: string;
      zone_no: string;
    };
  }>;
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
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
  ): Promise<Coord2AddressResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<Coord2AddressResponse>(
      `/api/places/coord2address?x=${x}&y=${y}`
    );

    return response.data;
  }

  /**
   * 주소를 좌표로 변환
   */
  public async address2Coord(query: string): Promise<Address2CoordResponse> {
    const axiosInstance = frontendAxiosInstance.getAxiosInstance();

    const response = await axiosInstance.get<Address2CoordResponse>(
      `/api/places/address2coord?query=${encodeURIComponent(query)}`
    );

    return response.data;
  }
}

export const placesApi = PlacesApi.getInstance();
export default placesApi;
