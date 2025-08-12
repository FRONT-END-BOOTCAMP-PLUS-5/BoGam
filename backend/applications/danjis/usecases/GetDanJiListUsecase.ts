import { DanJiRepository } from '@be/infrastructure/repository/DanjiRepository';
import { GetDanJiListRequestDto } from '@be/applications/danjis/dtos/GetDanjiListRequestDto';
import { GetDanJiListResponseDto } from '@be/applications/danjis/dtos/GetDanjiListResponseDto';

export class GetDanJiListUsecase {
  private readonly repository: DanJiRepository;

  constructor(repository: DanJiRepository) {
    this.repository = repository;
  }

  async getDanjiList(
    request: GetDanJiListRequestDto
  ): Promise<GetDanJiListResponseDto> {
    const response = await this.repository.fetchDanJiList(request);

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
