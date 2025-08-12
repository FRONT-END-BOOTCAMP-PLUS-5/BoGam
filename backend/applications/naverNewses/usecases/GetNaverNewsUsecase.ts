import { NaverNewsEntity } from '@be/domain/entities/NaverNews';
import { NewsRepository } from '@be/domain/repository/NewsRepository';

export class GetNaverNewsUsecase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNewsEntity[]> {
    return await this.repository.fetchNews();
  }
}
