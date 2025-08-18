import { PlaceRepository } from '@be/domain/repository/PlaceRepository';
import { PlaceSearchApiResponseDto } from '@be/applications/places/dtos/PlaceSearchApiResponseDto';
import { CoordinateResponseDto } from '@be/applications/places/dtos/CoordinateResponseDto';
import { AddressResponseDto } from '@be/applications/places/dtos/AddressResponseDto';
import { KakaoApiResponseDto } from '@be/applications/places/dtos/KakaoApiResponseDto';

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

  async addressToCoord(query: string): Promise<CoordinateResponseDto | null> {
    const response = await this.repository.addressToCoord(query);
    if (response.documents && response.documents.length > 0) {
      return {
        x: parseFloat(response.documents[0].x),
        y: parseFloat(response.documents[0].y),
      };
    }
    return null;
  }

  async coordToAddress(
    x: string,
    y: string
  ): Promise<AddressResponseDto | null> {
    const response = await this.repository.coordToAddress(x, y);
    if (response.documents && response.documents.length > 0) {
      return {
        address: response.documents[0].address.address_name,
      };
    }
    return null;
  }
}
