import { GuaranteeLimitRepository } from '@be/domain/repository/GuaranteeLimitRepository';
import { GetGuaranteeLimitRequestDto } from '@be/applications/guaranteeLimits/dtos/GetGuaranteeLimitRequestDto';
import { GetGuaranteeLimitResponseDto } from '@be/applications/guaranteeLimits/dtos/GetGuaranteeLimitResponseDto';

export class GetGuaranteeLimitUsecase {
  constructor(private guaranteeLimitRepository: GuaranteeLimitRepository) {}

  async execute(
    requestDto: GetGuaranteeLimitRequestDto
  ): Promise<GetGuaranteeLimitResponseDto> {
    const requestId = `guarantee-limit-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    console.log(`🚀 [${requestId}] 전세자금보증상품 조회 UseCase 실행 시작`);
    console.log(
      `📝 [${requestId}] 요청 데이터:`,
      JSON.stringify(requestDto, null, 2)
    );

    try {
      // Repository를 통해 데이터 조회
      console.log(`🔍 [${requestId}] Repository 호출 시작`);
      const entity = await this.guaranteeLimitRepository.getGuaranteeLimit(
        requestDto
      );
      console.log(`✅ [${requestId}] Repository 호출 성공:`, {
        resultCode: entity.resultCode,
        resultMsg: entity.resultMsg,
        totalCount: entity.totalCount,
        itemsCount: entity.items.length,
      });

      // Entity를 Response DTO로 변환
      const response = {
        header: {
          resultCode: entity.resultCode,
          resultMsg: entity.resultMsg,
        },
        items: entity.items.map((item) => ({
          rcmdProrRnk: item.rcmdProrRnk,
          grntDvcd: item.grntDvcd,
          loanLmtAmt: item.loanLmtAmt,
          grntLmtAmt: item.grntLmtAmt,
        })),
        numOfRows: entity.numOfRows,
        pageNo: entity.pageNo,
        totalCount: entity.totalCount,
      };

      console.log(`🎯 [${requestId}] UseCase 실행 완료:`, {
        header: response.header,
        totalCount: response.totalCount,
        itemsCount: response.items.length,
      });

      return response;
    } catch (error) {
      console.error(
        `❌ [${requestId}] 전세자금보증상품 조회 UseCase 실행 중 오류:`,
        error
      );
      throw error;
    }
  }
}
