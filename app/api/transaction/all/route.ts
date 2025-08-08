import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUseCase } from '@be/applications/transaction/usecases/GetRealEstateTransactionUseCase';
import { GetRealEstateTransactionRequest } from '@be/applications/transaction/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '@be/applications/transaction/dtos/GetRealEstateTransactionResponse';
import { generateDealYearMonthRange, getCurrentYearMonth } from '@utils/dateUtils';

/**
 * 모든 실거래가 조회 API (통합)
 * GET /api/transaction/all
 * 
 * 기능:
 * - DEAL_YMD를 입력하면 해당 월부터 현재까지의 모든 데이터를 수집
 * - 예: DEAL_YMD=202404 → 2024년 4월부터 현재(2025년 8월)까지의 모든 실거래가
 * - 4개 주택 유형(아파트, 단독/다가구, 오피스텔, 연립다세대) 통합 조회
 */
export async function GET(request: NextRequest) {
  try {
    // 1. URL에서 쿼리 파라미터를 가져와서
    const { searchParams } = new URL(request.url);
    const LAWD_CD = searchParams.get('LAWD_CD');
    const DEAL_YMD = searchParams.get('DEAL_YMD');
    const numOfRows = searchParams.get('numOfRows') || '1000';

    // 2. 필수 파라미터 검증
    if (!LAWD_CD || !DEAL_YMD) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'LAWD_CD와 DEAL_YMD는 필수 파라미터입니다.' 
        },
        { status: 400 }
      );
    }

    // 3. DEAL_YMD 형식 검증 (YYYYMM)
    if (!/^\d{6}$/.test(DEAL_YMD)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'DEAL_YMD는 YYYYMM 형식이어야 합니다. (예: 202404)' 
        },
        { status: 400 }
      );
    }

    console.log(`🚀 실거래가 통합 API 호출: ${LAWD_CD} 지역, ${DEAL_YMD}부터 현재까지`);

    // 4. UseCase 인스턴스 생성
    const useCase = new GetRealEstateTransactionUseCase();

    // 5. 각 주택 유형별로 범위 데이터 수집 (병렬 처리)
    console.log(`📄 각 주택 유형별 범위 데이터 조회 중...`);
    
    const [apartment, detachedHouse, officetel, rowHouse] = await Promise.all([
      useCase.getAllApartmentTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
      useCase.getAllDetachedHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
      useCase.getAllOfficetelTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
      useCase.getAllRowHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) })
    ]);

    // 6. 모든 데이터 통합
    const allItems = [
      ...(apartment.body.items.item || []),
      ...(detachedHouse.body.items.item || []),
      ...(officetel.body.items.item || []),
      ...(rowHouse.body.items.item || [])
    ];

    // 7. 요약 정보 생성
    const currentYearMonth = getCurrentYearMonth();
    const dealYearMonths = generateDealYearMonthRange(DEAL_YMD);
    
    const summary = {
      dateRange: {
        startDate: DEAL_YMD,
        endDate: currentYearMonth,
        totalMonths: dealYearMonths.length
      },
      totalCount: allItems.length,
      apartmentCount: apartment.body.items.item?.length || 0,
      detachedHouseCount: detachedHouse.body.items.item?.length || 0,
      officetelCount: officetel.body.items.item?.length || 0,
      rowHouseCount: rowHouse.body.items.item?.length || 0,
      collectedCount: allItems.length
    };

    // 8. 응답 반환
    const response = {
      success: true,
      data: {
        items: { item: allItems },
        numOfRows: allItems.length.toString(),
        pageNo: "1",
        totalCount: allItems.length.toString()
      },
      summary
    };

    console.log(`✅ 실거래가 통합 조회 완료: 총 ${allItems.length}건`);
    console.log(`📊 요약: 아파트 ${summary.apartmentCount}건, 단독/다가구 ${summary.detachedHouseCount}건, 오피스텔 ${summary.officetelCount}건, 연립다세대 ${summary.rowHouseCount}건`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ 실거래가 통합 API 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '실거래가 조회 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
