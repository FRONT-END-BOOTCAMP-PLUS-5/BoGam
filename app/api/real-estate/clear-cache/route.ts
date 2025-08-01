import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateDataUseCase } from '../../../../backend/realEstate/applications/usecases/RealEstateDataUseCase';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    useCase.clearTokenCache();

    return NextResponse.json({
      success: true,
      message: '토큰 캐시가 초기화되었습니다.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('캐시 초기화 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
