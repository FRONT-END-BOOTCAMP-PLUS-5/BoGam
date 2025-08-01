import { NewsRepository } from '@be/domain/repository/NewsRepository';
import { NaverNewsResponseDto } from '@be/applications/naverNews/dtos/NaverNewsDto';

export class GetNaverNewsUseCase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNewsResponseDto> {
    return await this.repository.fetchNews();
  }
}
