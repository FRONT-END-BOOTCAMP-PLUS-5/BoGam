export interface KakaoApiPlaceDocument {
  place_name?: string;
  address_name: string;
  x: string;
  y: string;
}

export interface KakaoApiResponse {
  documents: KakaoApiPlaceDocument[];
}
