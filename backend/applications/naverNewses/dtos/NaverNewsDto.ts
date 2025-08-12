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
