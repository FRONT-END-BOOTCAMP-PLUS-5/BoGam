import { NaverNewsResponseDto } from "../../applications/dtos/NaverNewsDto";

export interface NewsRepository {
  fetchNews(): Promise<NaverNewsResponseDto>;
}
