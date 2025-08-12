import { DanjiSerialNumberRequestDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberRequestDto';
import { GetDanjiSerialNumberResponseDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberResponseDto';
import { DanjiSerialNumberRepository } from '@be/domain/repository/DanjiSerialNumberRepository';

export class DanjiSerialNumberUsecase {
  constructor(
    private readonly danjiSerialNumberRepository: DanjiSerialNumberRepository
  ) {}

  async getDanjiSerialNumber(
    request: DanjiSerialNumberRequestDto
  ): Promise<GetDanjiSerialNumberResponseDto> {
    try {
      const response =
        await this.danjiSerialNumberRepository.getDanjiSerialNumber(request);
      return response;
    } catch (error) {
      throw new Error(`단지 일련번호 조회 중 오류가 발생했습니다: ${error}`);
    }
  }
}
