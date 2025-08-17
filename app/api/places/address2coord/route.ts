import { NextRequest, NextResponse } from 'next/server';
import { SearchPlaceUsecase } from '@be/applications/places/usecases/SearchPlaceUsecase';
import { PlaceRepositoryImpl } from '@be/infrastructure/repository/PlaceRepositoryImpl';

// GET /api/places/address2coord?query=주소
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { message: 'query(주소) 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  console.log('query', query);

  const repository = new PlaceRepositoryImpl();
  const usecase = new SearchPlaceUsecase(repository);

  try {
    const results = await usecase.addressToCoord(query);
    return NextResponse.json(results);
  } catch (err) {
    console.error('[Address2CoordError]', err);
    return NextResponse.json(
      { message: '주소 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
