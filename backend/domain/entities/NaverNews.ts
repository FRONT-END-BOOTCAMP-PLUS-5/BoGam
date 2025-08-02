import { NaverNewsItemDto } from '@be/applications/naverNews/dtos/NaverNewsDto';

export class NaverNews {
  constructor(
    public readonly title: string,
    public readonly originallink: string,
    public readonly link: string,
    public readonly description: string,
    public readonly pubDate: string
  ) {}

  static fromDto(dto: NaverNewsItemDto): NaverNews {
    return new NaverNews(
      dto.title,
      dto.originallink,
      dto.link,
      dto.description,
      dto.pubDate
    );
  }
}
