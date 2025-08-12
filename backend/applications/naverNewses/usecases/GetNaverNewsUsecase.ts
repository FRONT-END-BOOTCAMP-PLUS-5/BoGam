import { NaverNews } from '@be/domain/entities/NaverNews';
import { NewsRepository } from '@be/domain/repository/NewsRepository';

export class GetNaverNewsUsecase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNews[]> {
    return await this.repository.fetchNews();
  }
}
