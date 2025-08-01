import { NewsRepository } from "@be/naver-news/domain/repository/NewsRepository";
import { NaverNews } from "@be/naver-news/domain/entities/NaverNews";

export class GetNaverNewsUseCase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNews[]> {
    return await this.repository.fetchNews();
  }
}
