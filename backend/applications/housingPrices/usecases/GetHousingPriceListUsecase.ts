import { HousingPriceRepository } from '@be/infrastructure/repository/HousingPriceRepository';
import { GetHousingPriceRequestDto } from '@be/applications/housingPrices/dtos/GetHousingPriceListRequestDto';
import { GetHousingPriceResponseDto } from '@be/applications/housingPrices/dtos/GetHousingPriceListResponseDto';

export class GetHousingPriceListUsecase {
  private readonly repository: HousingPriceRepository;

  constructor(repository: HousingPriceRepository) {
    this.repository = repository;
  }

  async getHousingPriceList(
    request: GetHousingPriceRequestDto
  ): Promise<GetHousingPriceResponseDto> {
    const response = await this.repository.fetchHousingPriceList(request);

    if (!response.data) {
      return {
        result: response.result,
        data: [],
      };
    }

    return {
      result: response.result,
      data: response.data,
    };
  }
}
