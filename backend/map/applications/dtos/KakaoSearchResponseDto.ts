export interface KakaoPlace {
  name: string;
  address: string;
  x: string;
  y: string;
  source: "keyword" | "address";
}

export interface KakaoSearchResponseDto {
  results: KakaoPlace[];
}
