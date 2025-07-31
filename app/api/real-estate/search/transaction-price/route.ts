import { NextRequest, NextResponse } from 'next/server';
import { RealEstateTransactionUseCase } from '../../../../../backend/realEstate/applications/usecases/RealEstateTransactionUseCase';
import { GetRealEstateTransactionRequest } from '../../../../../backend/realEstate/applications/dtos/GetRealEstateTransactionRequest';

/**
 * 실거래가 조회 API
 * GET /api/real-estate/search/transaction-price
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
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
    
    // 환경변수에서 서비스키 가져오기
    const serviceKey = process.env.RTMSDATA_TRANSACTION_PRICE_KEY;
    if (!serviceKey) {
      return NextResponse.json(
        { success: false, message: '서비스키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    // 요청 데이터 구성
    const requestData: GetRealEstateTransactionRequest = {
      LAWD_CD,
      DEAL_YMD,
      serviceKey,
      numOfRows,
      pageNo,
    };
    
    // 유스케이스 실행
    const useCase = new RealEstateTransactionUseCase();
    const response = await useCase.findAll(requestData);
    
    // 성공 응답
    return NextResponse.json({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error('실거래가 조회 API 에러:', error);
    
    // 에러 응답
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 