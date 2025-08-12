import { HousingPriceEntity } from '@be/domain/entities/HousingPrice';

export interface GetHousingPriceResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: HousingPriceEntity[];
}
