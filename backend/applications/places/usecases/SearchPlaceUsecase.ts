import {
  PlaceRepository,
  KakaoApiResponse,
} from '@be/domain/repository/PlaceRepository';
import { PlaceSearchApiResponseDto } from '@be/applications/places/dtos/PlaceSearchApiResponseDto';

export class SearchPlaceUsecase {
  constructor(private readonly repository: PlaceRepository) {}

  async searchLocation(query: string): Promise<PlaceSearchApiResponseDto[]> {
    const places = await this.repository.search(query);
    return places.map((place) => ({
      name: place.name,
      address: place.address,
      longitude: place.longitude,
      latitude: place.latitude,
    }));
  }

  async searchByKeyword(query: string): Promise<PlaceSearchApiResponseDto[]> {
    const places = await this.repository.searchByKeyword(query);
    return places.map((place) => ({
      name: place.name,
      address: place.address,
      longitude: place.longitude,
      latitude: place.latitude,
    }));
  }

  async addressToCoord(query: string): Promise<KakaoApiResponse> {
    return await this.repository.addressToCoord(query);
  }

  async coordToAddress(x: string, y: string): Promise<KakaoApiResponse> {
    return await this.repository.coordToAddress(x, y);
  }
}
