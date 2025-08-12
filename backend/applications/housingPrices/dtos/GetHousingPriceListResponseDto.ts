import { HousingPriceEntity } from '@be/domain/entities/HousingPrice';

export interface GetHousingPriceListResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: HousingPriceEntity[];
}
