import axios from 'axios';
import { KakaoSearchRepository } from '../../domain/repository/KakaoSearchRepository';
import { KakaoSearchResponseDto, KakaoPlace } from '../../applications/dtos/KakaoSearchResponseDto';
import { SaveSelectedAddressDto } from '../../applications/dtos/SaveSelectedAddressDto';

const KAKAO_API_KEY = process.env.KAKAO_REST_API_KEY!;
const headers = { Authorization: `KakaoAK ${KAKAO_API_KEY}` };

export class KakaoSearchRepositoryImpl implements KakaoSearchRepository {
  async search(query: string): Promise<KakaoSearchResponseDto> {
    const [keywordRes, addressRes] = await Promise.all([
      axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
        headers,
        params: { query },
      }),
      axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
        headers,
        params: { query },
      }),
    ]);

    const keywordData: KakaoPlace[] = keywordRes.data.documents.map((doc: any) => ({
      name: doc.place_name,
      address: doc.road_address_name || doc.address_name,
      x: doc.x,
      y: doc.y,
      source: 'keyword',
    }));

    const addressData: KakaoPlace[] = addressRes.data.documents.map((doc: any) => ({
      name: doc.address_name,
      address: doc.road_address_name || doc.address_name,
      x: doc.x,
      y: doc.y,
      source: 'address',
    }));

    const all = [...keywordData, ...addressData];
    const unique = new Map<string, KakaoPlace>();
    for (const item of all) {
      if (!unique.has(item.address)) {
        unique.set(item.address, item);
      }
    }

    return { results: Array.from(unique.values()) };
  }

  async saveSelectedAddress(data: SaveSelectedAddressDto): Promise<void> {
    console.log('[저장된 주소]', data);
  }
}
