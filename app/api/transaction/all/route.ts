import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUseCase } from '@be/applications/transaction/usecases/GetRealEstateTransactionUseCase';
import { GetRealEstateTransactionResponse } from '@be/applications/transaction/dtos/GetRealEstateTransactionResponse';
import { generateDealYearMonthRange, getCurrentYearMonth } from '@utils/dateUtils';

/**
 * 모든 실거래가 조회 API (통합)
 * GET /api/transaction/all
 * 
 * 기능:
 * - DEAL_YMD를 입력하면 해당 월부터 현재까지의 모든 데이터를 수집
 * - 예: DEAL_YMD=202404 → 2024년 4월부터 현재(2025년 8월)까지의 모든 실거래가
 */
export async function GET(request: NextRequest) {
  try {
    // 1. URL에서 쿼리 파라미터를 가져와서
    const { searchParams } = new URL(request.url);
    const LAWD_CD = searchParams.get('LAWD_CD');
    const DEAL_YMD = searchParams.get('DEAL_YMD');
    const numOfRows = searchParams.get('numOfRows') || '1000';
    const getAllData = searchParams.get('getAllData') === 'true'; // 전체 데이터 수집 여부

    // 필수 파라미터 검증
    if (!LAWD_CD) {
      return NextResponse.json(
        { success: false, message: 'LAWD_CD 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!DEAL_YMD) {
      return NextResponse.json(
        { success: false, message: 'DEAL_YMD 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 2. UseCase 인스턴스 생성
    const useCase = new GetRealEstateTransactionUseCase();

    let response: {
      apartment: GetRealEstateTransactionResponse;
      detachedHouse: GetRealEstateTransactionResponse;
      officetel: GetRealEstateTransactionResponse;
      rowHouse: GetRealEstateTransactionResponse;
    };

    // 3. 계약년월 범위 계산
    const dealYearMonths = generateDealYearMonthRange(DEAL_YMD);
    const currentYearMonth = getCurrentYearMonth();
    
    console.log(`🔄 ${LAWD_CD} 지역 ${DEAL_YMD}~${currentYearMonth} 실거래가 범위 조회 시작...`);
    console.log(`📅 수집할 계약년월: ${dealYearMonths.length}개월`);

    if (getAllData) {
      // 전체 데이터 수집 모드 (범위 조회)
      console.log(`📊 전체 데이터 수집 모드 - 각 주택 유형별 범위 데이터 수집 중...`);
      //모든 page를 순회하면서 범위 기간 내 데이터 모두 수집
      const [apartment, detachedHouse, officetel, rowHouse] = await Promise.all([
        useCase.getAllApartmentTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: 1000 }),
        useCase.getAllDetachedHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: 1000 }),
        useCase.getAllOfficetelTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: 1000 }),
        useCase.getAllRowHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: 1000 })
      ]);

      response = { apartment, detachedHouse, officetel, rowHouse };
    } else {
      // 일반 모드 (범위 조회, 첫 페이지만)
      console.log(`📄 일반 모드 - 각 주택 유형별 범위 데이터 조회 중...`);
      
      // 각 주택 유형별로 범위 데이터 수집
      const [apartment, detachedHouse, officetel, rowHouse] = await Promise.all([
        useCase.getAllApartmentTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
        useCase.getAllDetachedHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
        useCase.getAllOfficetelTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) }),
        useCase.getAllRowHouseTransactionsByDateRange(LAWD_CD, DEAL_YMD, { batchSize: parseInt(numOfRows) })
      ]);

      response = { apartment, detachedHouse, officetel, rowHouse };
    }

    // 4. 응답 데이터에 요약 정보 추가
    const summary = {
      dateRange: {
        startDate: DEAL_YMD,
        endDate: currentYearMonth,
        totalMonths: dealYearMonths.length
      },
      totalCount: 
        parseInt(response.apartment.body.totalCount) +
        parseInt(response.detachedHouse.body.totalCount) +
        parseInt(response.officetel.body.totalCount) +
        parseInt(response.rowHouse.body.totalCount),
      apartmentCount: parseInt(response.apartment.body.totalCount),
      detachedHouseCount: parseInt(response.detachedHouse.body.totalCount),
      officetelCount: parseInt(response.officetel.body.totalCount),
      rowHouseCount: parseInt(response.rowHouse.body.totalCount),
      collectedCount: 
        (response.apartment.body.items.item?.length || 0) +
        (response.detachedHouse.body.items.item?.length || 0) +
        (response.officetel.body.items.item?.length || 0) +
        (response.rowHouse.body.items.item?.length || 0)
    };

    // 응답 데이터를 JSON 형식으로 반환
    return NextResponse.json({
      success: true,
      data: response,
      summary,
      status: 200,
    });
  } catch (error) {
    console.error('통합 실거래가 조회 API 에러:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : '서버 내부 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
