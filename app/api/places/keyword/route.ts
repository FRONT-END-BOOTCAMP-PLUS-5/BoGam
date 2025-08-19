import { NextRequest, NextResponse } from 'next/server';
import { SearchPlaceUsecase } from '@be/applications/places/usecases/SearchPlaceUsecase';
import { PlaceRepositoryImpl } from '@be/infrastructure/repository/PlaceRepositoryImpl';

// GET /api/places/keyword?query=
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
  const usecase = new SearchPlaceUsecase(repository);

  try {
    // 키워드 전용 검색을 위해 별도 메서드 호출
    const results = await usecase.searchByKeyword(query);
    return NextResponse.json(results);
  } catch (err) {
    console.error('[KakaoKeywordSearchError]', err);
    return NextResponse.json(
      { message: '키워드 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
