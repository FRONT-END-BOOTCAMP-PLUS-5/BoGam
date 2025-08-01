import { KakaoSearchResponseDto } from "../../applications/dtos/KakaoSearchResponseDto";
import { SaveSelectedAddressDto } from "../../applications/dtos/SaveSelectedAddressDto";

export interface KakaoSearchRepository {
  search(query: string): Promise<KakaoSearchResponseDto>;
  saveSelectedAddress(data: SaveSelectedAddressDto): Promise<void>;
}
