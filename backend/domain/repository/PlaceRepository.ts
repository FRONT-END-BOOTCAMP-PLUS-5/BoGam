import { Place } from '@be/domain/entities/Place';

export interface PlaceRepository {
  search(query: string): Promise<Place[]>;
}
