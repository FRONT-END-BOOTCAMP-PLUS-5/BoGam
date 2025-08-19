import { PlaceEntity } from '@be/domain/entities/Place';
import { KakaoApiResponseDto } from '@be/applications/places/dtos/KakaoApiResponseDto';
import { CoordinateResponseDto } from '@be/applications/places/dtos/CoordinateResponseDto';
import { AddressResponseDto } from '@be/applications/places/dtos/AddressResponseDto';

export interface PlaceRepository {
  search(query: string): Promise<PlaceEntity[]>;
  searchByKeyword(query: string): Promise<PlaceEntity[]>;
  addressToCoord(query: string): Promise<KakaoApiResponseDto>;
  coordToAddress(x: string, y: string): Promise<KakaoApiResponseDto>;
}
