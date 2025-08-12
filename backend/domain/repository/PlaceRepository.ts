import { PlaceEntity } from '@be/domain/entities/Place';

export interface PlaceRepository {
  search(query: string): Promise<PlaceEntity[]>;
}
