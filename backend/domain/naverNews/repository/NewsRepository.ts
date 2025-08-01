import { NaverNewsResponseDto } from "../../../applications/naverNews/dtos/NaverNewsDto";

export interface NewsRepository {
  fetchNews(): Promise<NaverNewsResponseDto>;
}
