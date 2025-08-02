import { NextRequest, NextResponse } from 'next/server';
import { SearchPlaceUseCase } from '@be/applications/place/usecases/SearchPlaceUseCase';
import { PlaceRepositoryImpl } from '@be/infrastructure/repository/PlaceRepositoryImpl';

// GET /api/place?query=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { message: 'query 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const repository = new PlaceRepositoryImpl();
  const useCase = new SearchPlaceUseCase(repository);

  try {
    const results = await useCase.searchLocation(query);
    return NextResponse.json(results);
  } catch (err) {
    console.error('[KakaoSearchError]', err);
    return NextResponse.json(
      { message: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
