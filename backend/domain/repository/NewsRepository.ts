import { NaverNews } from '@be/domain/entities/NaverNews';

export interface NewsRepository {
  fetchNews(): Promise<NaverNews[]>;
}
