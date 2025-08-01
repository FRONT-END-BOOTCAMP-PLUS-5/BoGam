import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUseCase } from '../../../../../backend/realEstate/applications/usecases/GetRealEstateTransactionUseCase';
import { GetRealEstateTransactionRequest } from '../../../../../backend/realEstate/applications/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '../../../../../backend/realEstate/applications/dtos/GetRealEstateTransactionResponse';

/**
 * 실거래가 조회 API
 * GET /api/real-estate/search/transaction-price
 */
export async function GET(request: NextRequest) {
  try {
    // 1. URL에서 쿼리 파라미터를 가져와서
    const { searchParams } = new URL(request.url);
    const LAWD_CD = searchParams.get('LAWD_CD');
    const DEAL_YMD = searchParams.get('DEAL_YMD');
    const numOfRows = searchParams.get('numOfRows') || '10';
    const pageNo = searchParams.get('pageNo') || '1';

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

    // 2. 쿼리를 위해 전달할 DTO 생성한 후
    const requestData: GetRealEstateTransactionRequest = {
      LAWD_CD,
      DEAL_YMD,
      numOfRows,
      pageNo,
    };

    // 3. 쿼리를 위해 전달할 DTO를 Usecase에게 전달해서 실행한다.
    const useCase = new GetRealEstateTransactionUseCase();
    const response: GetRealEstateTransactionResponse = await useCase.execute(
      requestData
    );

    // 응답 데이터를 JSON 형식으로 반환 (DTO 타입 명시)
    return NextResponse.json({
      success: true,
      data: response as GetRealEstateTransactionResponse,
      status: 200,
    });
  } catch (error) {
    console.error('실거래가 조회 API 에러:', error);

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
