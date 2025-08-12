import axios from 'axios';
import { NaverNewsEntity } from '@be/domain/entities/NaverNews';
import { NewsRepository } from '@be/domain/repository/NewsRepository';
import {
  NaverNewsItemDto,
  NaverNewsResponseDto,
} from '@be/applications/naverNewses/dtos/NaverNewsDto';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET_NO!;

export class NewsRepositoryImpl implements NewsRepository {
  async fetchNews(): Promise<NaverNewsEntity[]> {
    const response = await axios.get<NaverNewsResponseDto>(
      'https://openapi.naver.com/v1/search/news.json',
      {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        },
        params: { query: '전세사기', display: 5, start: 1, sort: 'date' },
      }
    );

    return response.data.items.map((item: NaverNewsItemDto) =>
      NaverNewsEntity.fromDto(item)
    );
  }
}
