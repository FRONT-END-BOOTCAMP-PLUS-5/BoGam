import { NaverNewsResponseDto } from "../../../applications/naver-news/dtos/NaverNewsDto";

export interface NewsRepository {
  fetchNews(): Promise<NaverNewsResponseDto>;
}
