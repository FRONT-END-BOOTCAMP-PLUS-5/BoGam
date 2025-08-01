import { NewsRepository } from "@/backend/naver-news/domain/repository/NewsRepository";
import { NaverNewsResponseDto } from "../../applications/dtos/NaverNewsDto";

export class GetNaverNewsUseCase {
  constructor(private readonly repository: NewsRepository) {}

  async fetchNaverNews(): Promise<NaverNewsResponseDto> {
    return await this.repository.fetchNews();
  }
}
