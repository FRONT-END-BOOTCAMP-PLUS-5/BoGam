import axios from "axios";
import { KakaoPlace } from "@be/map/domain/entities/KakaoPlace";
import { KakaoSearchRepository } from "@be/map/domain/repository/KakaoSearchRepository";
import { KakaoSearchResponseDto } from "@be/map/applications/dtos/KakaoSearchResponseDto";
import {
  KakaoApiPlaceDocument,
  KakaoApiResponse,
} from "@be/map/applications/dtos/KakaoApiPlaceDocument";

export class KakaoSearchRepositoryImpl implements KakaoSearchRepository {
  private readonly BASE_URL = "https://dapi.kakao.com/v2/local";
  private readonly API_KEY = process.env.KAKAO_REST_API_KEY || "";

  async search(query: string): Promise<KakaoPlace[]> {
    const headers = {
      Authorization: `KakaoAK ${this.API_KEY}`,
    };

    const [keywordRes, addressRes] = await Promise.all([
      axios.get<KakaoApiResponse>(`${this.BASE_URL}/search/keyword.json`, {
        headers,
        params: { query },
      }),
      axios.get<KakaoApiResponse>(`${this.BASE_URL}/search/address.json`, {
        headers,
        params: { query },
      }),
    ]);

    const keywordDocs = keywordRes.data.documents || [];
    const addressDocs = addressRes.data.documents || [];

    const combined = [...keywordDocs, ...addressDocs].map(
      (doc: KakaoApiPlaceDocument): KakaoPlace =>
        new KakaoPlace(doc.place_name || "", doc.address_name, doc.x, doc.y)
    );

    // 중복 제거 (위도+경도로 비교)
    const uniqueMap = new Map<string, KakaoSearchResponseDto>();

    for (const item of combined) {
      const key = `${item.latitude},${item.longitude}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  }
}
