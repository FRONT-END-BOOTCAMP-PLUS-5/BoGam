import { HousingPriceEntity } from '@be/domain/entities/HousingPriceEntity';

export interface GetHousingPriceResponseDto {
  result: {
    code: string;
    message: string;
  };
  data: HousingPriceEntity[];
}
