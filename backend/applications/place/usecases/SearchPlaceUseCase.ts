import { PlaceRepository } from '@be/domain/repository/PlaceRepository';
import { PlaceSearchApiResponseDto } from '@be/applications/place/dtos/PlaceSearchApiResponseDto';

export class SearchPlaceUseCase {
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
}
