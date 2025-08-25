declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        InfoWindow: new (options: KakaoInfoWindowOptions) => KakaoInfoWindow;
        event: {
          addListener: (target: KakaoMap | KakaoMarker | KakaoInfoWindow, type: string, handler: () => void) => void;
          removeListener: (
            target: KakaoMap | KakaoMarker | KakaoInfoWindow,
            type: string,
            handler: () => void
          ) => void;
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

// 카카오맵 관련 인터페이스 정의
interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
  equals(latlng: KakaoLatLng): boolean;
  toString(): string;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  setMapTypeId(mapTypeId: string): void;
  getMapTypeId(): string;
  setBounds(bounds: KakaoLatLngBounds): void;
  getBounds(): KakaoLatLngBounds;
  panTo(latlng: KakaoLatLng): void;
  panBy(x: number, y: number): void;
  setZoomable(zoomable: boolean): void;
  setDraggable(draggable: boolean): void;
  getContainer(): HTMLElement;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getMap(): KakaoMap | null;
  setPosition(latlng: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
  setTitle(title: string): void;
  getTitle(): string;
  setClickable(clickable: boolean): void;
  getClickable(): boolean;
  setDraggable(draggable: boolean): void;
  getDraggable(): boolean;
}

interface KakaoInfoWindow {
  open(map: KakaoMap, marker?: KakaoMarker): void;
  close(): void;
  setContent(content: string | HTMLElement): void;
  getContent(): string | HTMLElement;
  setPosition(latlng: KakaoLatLng): void;
  getPosition(): KakaoLatLng;
  setZIndex(zIndex: number): void;
  getZIndex(): number;
  setVisible(visible: boolean): void;
  getVisible(): boolean;
}

interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  getSouthWest(): KakaoLatLng;
  getNorthEast(): KakaoLatLng;
  isEmpty(): boolean;
  toString(): string;
}

// 카카오맵 옵션 인터페이스
interface KakaoMapOptions {
  center?: KakaoLatLng;
  level?: number;
  mapTypeId?: string;
  draggable?: boolean;
  zoomable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClick?: boolean;
  disableDoubleTap?: boolean;
  keyboardShortcuts?: boolean;
  maxLevel?: number;
  minLevel?: number;
}

interface KakaoMarkerOptions {
  position: KakaoLatLng;
  map?: KakaoMap;
  zIndex?: number;
  title?: string;
  clickable?: boolean;
  draggable?: boolean;
  visible?: boolean;
}

interface KakaoInfoWindowOptions {
  content: string | HTMLElement;
  position?: KakaoLatLng;
  zIndex?: number;
  removable?: boolean;
  closeable?: boolean;
}

export {};
