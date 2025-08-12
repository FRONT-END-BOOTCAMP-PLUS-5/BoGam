import axios from 'axios';
import { Place } from '@be/domain/entities/Place';
import { PlaceRepository } from '@be/domain/repository/PlaceRepository';
import { PlaceSearchApiResponseDto } from '@be/applications/places/dtos/PlaceSearchApiResponseDto';
import {
  PlaceApiDto,
  PlaceApiResponse,
} from '@be/applications/places/dtos/PlaceApiDto';

export class PlaceRepositoryImpl implements PlaceRepository {
  private readonly BASE_URL = 'https://dapi.kakao.com/v2/local';
  private readonly API_KEY = process.env.KAKAO_REST_API_KEY || '';

  async search(query: string): Promise<Place[]> {
    const headers = {
      Authorization: `KakaoAK ${this.API_KEY}`,
    };

    const [keywordRes, addressRes] = await Promise.all([
      axios.get<PlaceApiResponse>(`${this.BASE_URL}/search/keyword.json`, {
        headers,
        params: { query },
      }),
      axios.get<PlaceApiResponse>(`${this.BASE_URL}/search/address.json`, {
        headers,
        params: { query },
      }),
    ]);

    const keywordDocs = keywordRes.data.documents || [];
    const addressDocs = addressRes.data.documents || [];

    const combined = [...keywordDocs, ...addressDocs].map(
      (doc: PlaceApiDto): Place =>
        new Place(doc.place_name || '', doc.address_name, doc.x, doc.y)
    );

    // 중복 제거 (위도+경도로 비교)
    const uniqueMap = new Map<string, PlaceSearchApiResponseDto>();

    for (const item of combined) {
      const key = `${item.latitude},${item.longitude}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  }
}
