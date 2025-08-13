import { DanjiRepository } from '@be/infrastructure/repository/DanjiRepository';
import { GetDanjiListRequestDto } from '@be/applications/danjis/dtos/GetDanjiListRequestDto';
import { GetDanjiListResponseDto } from '@be/applications/danjis/dtos/GetDanjiListResponseDto';

export class GetDanjiListUsecase {
  private readonly repository: DanjiRepository;

  constructor(repository: DanjiRepository) {
    this.repository = repository;
  }

  async getDanjiList(
    request: GetDanjiListRequestDto
  ): Promise<GetDanjiListResponseDto> {
    const response = await this.repository.fetchDanjiList(request);

    if (!response.data) {
      return {
        result: {
          code: response.result.code,
          message: response.result.message,
        },
        data: [],
      };
    }

    // 단일 객체인 경우 배열로 변환
    const dataArray = Array.isArray(response.data)
      ? response.data
      : [response.data];

    return {
      result: {
        code: response.result.code,
        message: response.result.message,
      },
      data: dataArray,
    };
  }
}
