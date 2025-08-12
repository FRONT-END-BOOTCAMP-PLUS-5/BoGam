import { NaverNewsEntity } from '@be/domain/entities/NaverNews';

export interface NewsRepository {
  fetchNews(): Promise<NaverNewsEntity[]>;
}
