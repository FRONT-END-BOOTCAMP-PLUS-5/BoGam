import { KakaoSearchRepository } from "@be/map/domain/repository/KakaoSearchRepository";
import { KakaoSearchResponseDto } from "@be/map/applications/dtos/KakaoSearchResponseDto";

export class SearchAddressUseCase {
  constructor(private readonly repository: KakaoSearchRepository) {}

  async searchLocation(query: string): Promise<KakaoSearchResponseDto[]> {
    const places = await this.repository.search(query);
    return places.map((place) => ({
      name: place.name,
      address: place.address,
      longitude: place.longitude,
      latitude: place.latitude,
    }));
  }
}
