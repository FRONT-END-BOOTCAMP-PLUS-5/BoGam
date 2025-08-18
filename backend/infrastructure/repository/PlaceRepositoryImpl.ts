import axios from 'axios';
import { PlaceEntity } from '@be/domain/entities/Place';
import { PlaceRepository } from '@be/domain/repository/PlaceRepository';
import { KakaoApiResponseDto } from '@be/applications/places/dtos/KakaoApiResponseDto';
import { PlaceSearchApiResponseDto } from '@be/applications/places/dtos/PlaceSearchApiResponseDto';
import {
  PlaceApiDto,
  PlaceApiResponse,
} from '@be/applications/places/dtos/PlaceApiDto';

export class PlaceRepositoryImpl implements PlaceRepository {
  private readonly BASE_URL = 'https://dapi.kakao.com/v2/local';
  private readonly API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || '';

  async search(query: string): Promise<PlaceEntity[]> {
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

    // 키워드 검색 결과를 우선적으로 사용
    const combined = [...keywordDocs, ...addressDocs].map(
      (doc: PlaceApiDto): PlaceEntity =>
        new PlaceEntity(doc.place_name || '', doc.address_name, doc.x, doc.y)
    );

    // 중복 제거 (위도+경도로 비교)
    const uniqueMap = new Map<string, PlaceEntity>();

    for (const item of combined) {
      const key = `${item.latitude},${item.longitude}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  }

  async searchByKeyword(query: string): Promise<PlaceEntity[]> {
    const headers = {
      Authorization: `KakaoAK ${this.API_KEY}`,
    };

    try {
      // 키워드 검색만 수행
      const keywordRes = await axios.get<PlaceApiResponse>(
        `${this.BASE_URL}/search/keyword.json`,
        {
          headers,
          params: { query },
        }
      );

      const keywordDocs = keywordRes.data.documents || [];

      const places = keywordDocs.map(
        (doc: PlaceApiDto): PlaceEntity =>
          new PlaceEntity(doc.place_name || '', doc.address_name, doc.x, doc.y)
      );

      // 중복 제거 (위도+경도로 비교)
      const uniqueMap = new Map<string, PlaceEntity>();

      for (const item of places) {
        const key = `${item.latitude},${item.longitude}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      }

      return Array.from(uniqueMap.values());
    } catch (error) {
      console.error('키워드 검색 실패:', error);
      return [];
    }
  }

  async addressToCoord(query: string): Promise<KakaoApiResponseDto> {
    const headers = {
      Authorization: `KakaoAK ${this.API_KEY}`,
    };

    try {
      const response = await axios.get<KakaoApiResponseDto>(
        `${this.BASE_URL}/search/address.json`,
        {
          headers,
          params: { query },
        }
      );

      return response.data;
    } catch (error) {
      console.error('주소 좌표 변환 실패:', error);
      throw error;
    }
  }

  async coordToAddress(x: string, y: string): Promise<KakaoApiResponseDto> {
    const headers = {
      Authorization: `KakaoAK ${this.API_KEY}`,
    };

    try {
      const response = await axios.get<KakaoApiResponseDto>(
        `${this.BASE_URL}/geo/coord2address.json`,
        {
          headers,
          params: { x, y },
        }
      );

      return response.data;
    } catch (error) {
      console.error('좌표 주소 변환 실패:', error);
      throw error;
    }
  }
}
