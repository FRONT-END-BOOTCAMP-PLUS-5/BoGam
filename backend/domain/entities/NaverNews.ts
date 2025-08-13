import { NaverNewsItemDto } from '@be/applications/naverNewses/dtos/NaverNewsDto';

export class NaverNewsEntity {
  constructor(
    public readonly title: string,
    public readonly originallink: string,
    public readonly link: string,
    public readonly description: string,
    public readonly pubDate: string
  ) {}

  static fromDto(dto: NaverNewsItemDto): NaverNewsEntity {
    return new NaverNewsEntity(
      dto.title,
      dto.originallink,
      dto.link,
      dto.description,
      dto.pubDate
    );
  }
}
