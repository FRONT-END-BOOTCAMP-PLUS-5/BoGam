import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import { GetRealEstateDataInfrastructure } from '@be/infrastructure/repository/GetRealEstateDataInfrastructure';
import { GetRealEstatesRequestDto } from '@be/applications/realEstate/dtos/GetRealEstatesRequestDto';
import {
  GetRealEstatesResponseDto,
  TwoWayResponse,
} from '@be/applications/realEstate/dtos/GetRealEstatesResponseDto';
import { RealEstateEntity } from '@be/domain/entities/RealEstateEntity';

export class GetRealEstatesUsecase {
  private readonly infrastructure: GetRealEstateDataInfrastructure;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.infrastructure = new GetRealEstateDataInfrastructure();
    this.codefAuth = createCodefAuth();
  }

  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  async getRealEstate(
    request: GetRealEstatesRequestDto
  ): Promise<GetRealEstatesResponseDto> {
    const response = await this.infrastructure.getRealEstateRegistry(request);

    return {
      result: response.result,
      data: response.data as RealEstateEntity | TwoWayResponse,
    };
  }

  /**
   * 2-way 인증 처리
   */
  async handleTwoWayAuth(
    twoWayRequest: Record<string, unknown>
  ): Promise<GetRealEstatesResponseDto> {
    const response = await this.infrastructure.handleTwoWayAuth(twoWayRequest);

    return {
      result: response.result,
      data: response.data as RealEstateEntity | TwoWayResponse,
    };
  }

  /**
   * 2-way 인증 필요 여부 확인
   */
  requiresTwoWayAuth(response: GetRealEstatesResponseDto): boolean {
    return (
      response.result?.code === 'CF-03002' ||
      (response.data &&
        'continue2Way' in response.data &&
        response.data.continue2Way === true)
    );
  }

  /**
   * 2-way 인증 정보 추출
   */
  extractTwoWayInfo(response: GetRealEstatesResponseDto): {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: TwoWayResponse['extraInfo'];
  } | null {
    const data = response.data;
    if (!data || !('continue2Way' in data)) {
      return null;
    }

    const twoWayData = data as TwoWayResponse;
    if (
      typeof twoWayData.jobIndex === 'number' &&
      typeof twoWayData.threadIndex === 'number' &&
      typeof twoWayData.jti === 'string' &&
      typeof twoWayData.twoWayTimestamp === 'number'
    ) {
      return {
        jobIndex: twoWayData.jobIndex,
        threadIndex: twoWayData.threadIndex,
        jti: twoWayData.jti,
        twoWayTimestamp: twoWayData.twoWayTimestamp,
        method: twoWayData.method,
        extraInfo: twoWayData.extraInfo,
      };
    }

    return null;
  }

  /**
   * 등기부등본 데이터 추출
   */
  extractRealEstateData(
    response: GetRealEstatesResponseDto
  ): RealEstateEntity | null {
    if (!response.data || 'continue2Way' in response.data) {
      return null;
    }
    return response.data as RealEstateEntity;
  }

  /**
   * API 성공 여부 확인 (CODEF 기준)
   */
  isSuccess(response: GetRealEstatesResponseDto): boolean {
    return response.result?.code === 'CF-00000';
  }
}
