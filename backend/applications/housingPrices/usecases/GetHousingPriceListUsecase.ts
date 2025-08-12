import { GetHousingPriceRequestDto } from '@be/applications/housingPrices/dtos/GetHousingPriceListRequestDto';
import { GetHousingPriceListResponseDto } from '@be/applications/housingPrices/dtos/GetHousingPriceListResponseDto';
import { HousingPriceRepository } from '@be/infrastructure/repository/HousingPriceRepository';

export class GetHousingPriceListUsecase {
  private readonly repository: HousingPriceRepository;

  constructor(repository: HousingPriceRepository) {
    this.repository = repository;
  }

  async getHousingPriceList(
    request: GetHousingPriceRequestDto
  ): Promise<GetHousingPriceListResponseDto> {
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
