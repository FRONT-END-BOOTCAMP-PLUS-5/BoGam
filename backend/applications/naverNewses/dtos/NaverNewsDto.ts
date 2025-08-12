//네이버 뉴스 검색 요청 DTO
export interface NaverNewsRequest {
  query: string; // 검색어 (예: "삼성전자")
  display?: number; // 출력 뉴스 수 (기본값: 10, 최대값: 100)
  start?: number; // 검색 시작 위치 (기본값: 1)
  sort?: 'date' | 'sim'; // 정렬 방식 ("date": 날짜순, "sim": 유사도순)
}
// 네이버 뉴스 검색 응답 DTO
export interface NaverNewsItemDto {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResponseDto {
  total: number;
  start: number;
  display: number;
  items: NaverNewsItemDto[];
}
