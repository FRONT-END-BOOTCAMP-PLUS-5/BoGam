import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUsecase } from '@be/applications/transactions/usecases/GetRealEstateTransactionUsecase';
import {
  GetAllTransactionRequest,
  GetAllTransactionOptions,
} from '@be/applications/transactions/dtos/GetAllTransactionRequest';
import { GroupedByDongData } from '@be/applications/transactions/dtos/GetAllTransactionResponse';

/**
 * 동별 그룹화된 실거래가 조회 API
 * GET /api/transaction/grouped-by-dong
 *
 * 기능:
 * - DEAL_YMD를 입력하면 해당 월부터 현재까지의 모든 데이터를 수집
 * - 4개 주택 유형(아파트, 단독/다가구, 오피스텔, 연립다세대) 통합 조회
 * - 동별로 그룹화된 데이터만 반환
 */
export async function GET(request: NextRequest): Promise<
  NextResponse<
    | {
        success: boolean;
        data: GroupedByDongData;
        message?: string;
      }
    | {
        success: false;
        message: string;
      }
  >
> {
  try {
    // 1. URL에서 쿼리 파라미터를 가져와서 요청 DTO 생성
    const { searchParams } = new URL(request.url);
    const requestDto: GetAllTransactionRequest = {
      LAWD_CD: searchParams.get('LAWD_CD') || '',
      DEAL_YMD: searchParams.get('DEAL_YMD') || '',
      numOfRows: searchParams.get('numOfRows') || '1000',
    };

    // 2. 필수 파라미터 검증
    if (!requestDto.LAWD_CD || !requestDto.DEAL_YMD) {
      return NextResponse.json(
        {
          success: false,
          message: 'LAWD_CD와 DEAL_YMD는 필수 파라미터입니다.',
        },
        { status: 400 }
      );
    }

    // 3. DEAL_YMD 형식 검증 (YYYYMM)
    if (!/^\d{6}$/.test(requestDto.DEAL_YMD)) {
      return NextResponse.json(
        {
          success: false,
          message: 'DEAL_YMD는 YYYYMM 형식이어야 합니다. (예: 202404)',
        },
        { status: 400 }
      );
    }

    console.log(
      `🚀 동별 그룹화 실거래가 API 호출: ${requestDto.LAWD_CD} 지역, ${requestDto.DEAL_YMD}부터 현재까지`
    );

    // 4. Usecase 옵션 생성
    const options: GetAllTransactionOptions = {
      batchSize: parseInt(requestDto.numOfRows || '1000'),
    };

    // 5. Usecase 인스턴스 생성
    const usecase = new GetRealEstateTransactionUsecase();

    // 6. 통합 실거래가 조회 및 동별 그룹화
    console.log(`📄 통합 실거래가 조회 및 동별 그룹화 중...`);

    const { groupedByDong } = await usecase.getAllTransactionsWithGrouping(
      requestDto.LAWD_CD,
      requestDto.DEAL_YMD,
      options
    );

    // 7. 응답 생성
    const response = {
      success: true,
      data: groupedByDong,
      message: `동별 그룹화 완료: 총 ${groupedByDong.totalDongs}개 동`,
    };

    console.log(`✅ 동별 그룹화 실거래가 조회 완료`);
    console.log(
      `🏘️ 동별 그룹화: 총 ${groupedByDong.totalDongs}개 동, 가장 활발한 동: ${groupedByDong.mostActiveDong.dongName} (${groupedByDong.mostActiveDong.transactionCount}건)`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ 동별 그룹화 실거래가 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '동별 그룹화 실거래가 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
