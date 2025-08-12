import { SiseRepository } from '@be/infrastructure/repository/SiseRepository';
import { GetSiseInfoRequestDto } from '@be/applications/sises/dtos/GetSiseInfoRequestDto';
import { GetSiseInfoResponseDto } from '@be/applications/sises/dtos/GetSiseInfoResponseDto';

export class GetSiseInfoUsecase {
  private readonly repository: SiseRepository;

  constructor(repository: SiseRepository) {
    this.repository = repository;
  }

  async getSiseInfo(
    request: GetSiseInfoRequestDto
  ): Promise<GetSiseInfoResponseDto> {
    const response = await this.repository.fetchSiseInfo(request);

    return {
      result: response.result,
      data: response.data,
    };
  }
}
