import { NextResponse } from 'next/server';
import { NewsRepositoryImpl } from '@be/infrastructure/repository/NewsRepositoryImpl';
import { GetNaverNewsUseCase } from '@be/applications/naverNews/usecases/GetNaverNewsUseCase';

export async function GET() {
  const usecase = new GetNaverNewsUseCase(new NewsRepositoryImpl());

  try {
    const result = await usecase.fetchNaverNews();
    return NextResponse.json(result);
  } catch (error) {
    console.error('뉴스 요청 실패:', error);
    return NextResponse.json(
      { error: '네이버 뉴스 API 요청 중 오류 발생' },
      { status: 500 }
    );
  }
}
