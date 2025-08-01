import { KakaoPlace } from "../entities/KakaoPlace";

export interface KakaoSearchRepository {
  search(query: string): Promise<KakaoPlace[]>;
}
