import { NewsRepository } from "../../../domain/naverNews/repository/NewsRepository";
import { NaverNewsResponseDto } from "../dtos/NaverNewsDto";

export class GetNaverNewsUseCase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNewsResponseDto> {
    return await this.repository.fetchNews();
  }
}
