export interface Location {
  lat: number;
  lng: number;
}

export interface MarkerData {
  id: string;
  location: Location;
  title?: string;
  content?: string;
}

export interface KakaoMapOptions {
  center?: Location;
  level?: number;
  className?: string;
  style?: React.CSSProperties;
  useGPSFirst?: boolean;
  showCurrentLocationMarker?: boolean;
  showAddressInfo?: boolean;
  markerOptions?: {
    showInfoWindow?: boolean;
    infoWindowContent?: string | ((location: Location) => string);
    markerOptions?: Record<string, unknown>;
    infoWindowOptions?: Record<string, unknown>;
  };
}

export interface AddressInfo {
  address: {
    address_name: string;
    h_code: string;
    b_code: string;
    main_address_no: string;
    sub_address_no: string;
    mountain_yn: string;
    zip_code: string;
    zip_no: string;
  };
  road_address?: {
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
  };
}

// Kakao Maps 타입 정의
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (
          container: HTMLElement,
          options: Record<string, unknown>
        ) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => unknown;
        Marker: new (options: Record<string, unknown>) => unknown;
        InfoWindow: new (options: Record<string, unknown>) => unknown;
        event: {
          addListener: (
            target: unknown,
            type: string,
            handler: unknown
          ) => void;
        };
      };
    };
    daum: {
      Postcode: new (options: Record<string, unknown>) => {
        embed: (element: HTMLElement) => void;
      };
    };
  }
}
