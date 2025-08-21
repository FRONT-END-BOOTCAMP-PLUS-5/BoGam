import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUsecase } from '@be/applications/transactions/usecases/GetRealEstateTransactionUsecase';
import {
  GetAllTransactionRequest,
  GetAllTransactionOptions,
} from '@be/applications/transactions/dtos/GetAllTransactionRequest';
import {
  GetAllTransactionResponse,
  GetAllTransactionErrorResponse,
} from '@be/applications/transactions/dtos/GetAllTransactionResponse';
import {
  generateDealYearMonthRange,
  getCurrentYearMonth,
} from '@utils/dateUtils';

/**
 * 모든 실거래가 조회 API (통합)
 * GET /api/transaction/all
 *
 * 기능:
 * - DEAL_YMD를 입력하면 해당 월부터 현재까지의 모든 데이터를 수집
 * - 예: DEAL_YMD=202404 → 2024년 4월부터 현재(2025년 8월)까지의 모든 실거래가
 * - 4개 주택 유형(아파트, 단독/다가구, 오피스텔, 연립다세대) 통합 조회
 */
export async function GET(
  request: NextRequest
): Promise<
  NextResponse<GetAllTransactionResponse | GetAllTransactionErrorResponse>
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
      return NextResponse.json<GetAllTransactionErrorResponse>(
        {
          success: false,
          message: 'LAWD_CD와 DEAL_YMD는 필수 파라미터입니다.',
        },
        { status: 400 }
      );
    }

    // 3. DEAL_YMD 형식 검증 (YYYYMM)
    if (!/^\d{6}$/.test(requestDto.DEAL_YMD)) {
      return NextResponse.json<GetAllTransactionErrorResponse>(
        {
          success: false,
          message: 'DEAL_YMD는 YYYYMM 형식이어야 합니다. (예: 202404)',
        },
        { status: 400 }
      );
    }

    console.log(
      `🚀 실거래가 통합 API 호출: ${requestDto.LAWD_CD} 지역, ${requestDto.DEAL_YMD}부터 현재까지`
    );

    // 4. Usecase 옵션 생성
    const options: GetAllTransactionOptions = {
      batchSize: parseInt(requestDto.numOfRows || '1000'),
    };

    // 5. Usecase 인스턴스 생성
    const usecase = new GetRealEstateTransactionUsecase();

    // 6. 통합 실거래가 조회 및 동별 그룹화
    console.log(`📄 통합 실거래가 조회 및 동별 그룹화 중...`);

    const {
      apartment,
      detachedHouse,
      officetel,
      rowHouse,
      allItems,
      groupedByDong,
    } = await usecase.getAllTransactionsWithGrouping(
      requestDto.LAWD_CD,
      requestDto.DEAL_YMD,
      options
    );

    // 8. 요약 정보 생성
    const currentYearMonth = getCurrentYearMonth();
    const dealYearMonths = generateDealYearMonthRange(requestDto.DEAL_YMD);

    // 9. 응답 DTO 생성
    const response: GetAllTransactionResponse = {
      success: true,
      data: {
        items: { item: allItems },
        numOfRows: allItems.length.toString(),
        pageNo: '1',
        totalCount: allItems.length.toString(),
      },
      summary: {
        dateRange: {
          startDate: requestDto.DEAL_YMD,
          endDate: currentYearMonth,
          totalMonths: dealYearMonths.length,
        },
        totalCount: allItems.length,
        apartmentCount: apartment.body.items.item?.length || 0,
        detachedHouseCount: detachedHouse.body.items.item?.length || 0,
        officetelCount: officetel.body.items.item?.length || 0,
        rowHouseCount: rowHouse.body.items.item?.length || 0,
        collectedCount: allItems.length,
      },
      groupedByDong,
    };

    console.log(`✅ 실거래가 통합 조회 완료: 총 ${allItems.length}건`);
    console.log(
      `📊 요약: 아파트 ${response.summary.apartmentCount}건, 단독/다가구 ${response.summary.detachedHouseCount}건, 오피스텔 ${response.summary.officetelCount}건, 연립다세대 ${response.summary.rowHouseCount}건`
    );
    console.log(
      `🏘️ 동별 그룹화: 총 ${groupedByDong.totalDongs}개 동, 가장 활발한 동: ${groupedByDong.mostActiveDong.dongName} (${groupedByDong.mostActiveDong.transactionCount}건)`
    );

    return NextResponse.json<GetAllTransactionResponse>(response);
  } catch (error) {
    console.error('❌ 실거래가 통합 API 오류:', error);
    return NextResponse.json<GetAllTransactionErrorResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '실거래가 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
