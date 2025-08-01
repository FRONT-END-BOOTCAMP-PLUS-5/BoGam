import { NaverNewsResponseDto } from "@be/applications/naverNews/dtos/NaverNewsDto";

export interface NewsRepository {
  fetchNews(): Promise<NaverNewsResponseDto>;
}
