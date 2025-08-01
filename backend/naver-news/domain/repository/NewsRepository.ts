import { NaverNews } from "../entities/NaverNews";

export interface NewsRepository {
  fetchNews(): Promise<NaverNews[]>;
}
