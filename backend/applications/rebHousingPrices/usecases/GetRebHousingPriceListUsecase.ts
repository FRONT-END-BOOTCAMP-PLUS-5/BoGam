import { RebHousingPriceRepository } from '@be/infrastructure/repository/RebHousingPriceRepository';
import { GetRebHousingPriceListRequestDto } from '@be/applications/rebHousingPrices/dtos/GetRebHousingPriceListRequestDto';
import { GetRebHousingPriceListResponseDto } from '@be/applications/rebHousingPrices/dtos/GetRebHousingPriceListResponseDto';

export class GetRebHousingPriceListusecase {
  private readonly repository: RebHousingPriceRepository;

  constructor(repository: RebHousingPriceRepository) {
    this.repository = repository;
  }

  async getRebHousingPriceList(
    request: GetRebHousingPriceListRequestDto
  ): Promise<GetRebHousingPriceListResponseDto> {
    const response = await this.repository.getRebHousingPriceList(request);

    return {
      result: response.result,
      data: response.data,
    };
  }

  /**
   * 2-way 인증 필요 여부 확인
   * @param response API 응답
   * @returns 2-way 인증 필요 여부
   */
  requiresTwoWayAuth(response: GetRebHousingPriceListResponseDto): boolean {
    if ('continue2Way' in response.data) {
      return response.data.continue2Way === true;
    }
    return false;
  }
}
