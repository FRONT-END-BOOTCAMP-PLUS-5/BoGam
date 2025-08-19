import { NextRequest, NextResponse } from 'next/server';
import { SearchPlaceUsecase } from '@be/applications/places/usecases/SearchPlaceUsecase';
import { PlaceRepositoryImpl } from '@be/infrastructure/repository/PlaceRepositoryImpl';

// GET /api/places/coord2address?x=경도&y=위도
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const x = searchParams.get('x');
  const y = searchParams.get('y');

  if (!x || !y) {
    return NextResponse.json(
      { message: 'x(경도)와 y(위도) 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }

  const repository = new PlaceRepositoryImpl();
  const usecase = new SearchPlaceUsecase(repository);

  try {
    const results = await usecase.coordToAddress(x, y);
    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error('[Coord2AddressError]', err);
    return NextResponse.json(
      { message: '좌표 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
