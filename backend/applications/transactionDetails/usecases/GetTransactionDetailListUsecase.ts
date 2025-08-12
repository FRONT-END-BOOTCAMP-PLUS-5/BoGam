import { CodefAuth, createCodefAuth } from '@libs/codef/codefAuth';
import {
  GetTransactionDetailRequestDto,
  GetTransactionDetailQueryDto,
} from '@be/applications/transactionDetails/dtos/GetTransactionDetailRequestDto';
import { GetTransactionDetailResponseDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailResponseDto';
import { TransactionDetailApartRepositoryImpl } from '@be/infrastructure/repository/TransactionDetailApartRepositoryImpl';
import { TransactionDetailSingleRepositoryImpl } from '@be/infrastructure/repository/TransactionDetailSingleRepositoryImpl';

export class GetTransactionDetailListUsecase {
  private readonly apartRepository: TransactionDetailApartRepositoryImpl;
  private readonly singleRepository: TransactionDetailSingleRepositoryImpl;
  private readonly codefAuth: CodefAuth;

  constructor() {
    this.apartRepository = new TransactionDetailApartRepositoryImpl();
    this.singleRepository = new TransactionDetailSingleRepositoryImpl();
    this.codefAuth = createCodefAuth();
  }

  async getAccessToken(): Promise<string> {
    return this.codefAuth.getAccessToken();
  }

  async getTransactionDetailList(
    request: GetTransactionDetailQueryDto & GetTransactionDetailRequestDto
  ): Promise<GetTransactionDetailResponseDto> {
    if (request.type === 'apart') {
      // Apart 타입 처리
      if (!request.apartType || !request.buildingCode) {
        throw new Error(
          'Apart 타입 조회 시 apartType과 buildingCode는 필수입니다.'
        );
      }

      const apartRequest = {
        organization: '0010',
        type: request.apartType,
        buildingCode: request.buildingCode,
        contractYear: request.contractYear,
        contractType: request.contractType,
      };

      return this.apartRepository.getTransactionDetailApartList(apartRequest);
    } else if (request.type === 'single') {
      // Single 타입 처리
      if (!request.addrSido || !request.addrSigungu || !request.addrDong) {
        throw new Error(
          'Single 타입 조회 시 addrSido, addrSigungu, addrDong은 필수입니다.'
        );
      }

      const singleRequest = {
        organization: request.organization,
        addrSido: request.addrSido,
        addrSigungu: request.addrSigungu,
        addrDong: request.addrDong,
        contractYear: request.contractYear,
        contractType: request.contractType,
      };

      return this.singleRepository.getTransactionDetailSingleList(
        singleRequest
      );
    } else {
      throw new Error('type은 "apart" 또는 "single"이어야 합니다.');
    }
  }

  hasData(response: GetTransactionDetailResponseDto): boolean {
    if (!response.data) return false;

    if (Array.isArray(response.data)) {
      return response.data.length > 0;
    }

    // Apart 타입 데이터 확인
    if ('resSaleList' in response.data || 'resRentList' in response.data) {
      return !!(
        response.data.resSaleList?.length || response.data.resRentList?.length
      );
    }

    return true;
  }
}
