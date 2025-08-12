import { DanjiSerialNumberRequestDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberRequestDto';
import { GetDanjiSerialNumberResponseDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberResponseDto';

export interface DanjiSerialNumberRepository {
  getDanjiSerialNumber(
    request: DanjiSerialNumberRequestDto
  ): Promise<GetDanjiSerialNumberResponseDto>;
}
