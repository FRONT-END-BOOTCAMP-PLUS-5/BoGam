import { NextRequest, NextResponse } from 'next/server';
import { GetDanJiListusecase } from '@be/applications/danjis/usecases/GetDanJiListusecase';
import { DanJiRepository } from '@be/infrastructure/repository/DanJiRepository';
import { GetDanJiListRequestDto } from '@be/applications/danjis/dtos/GetDanJiListRequestDto';

const repository = new DanJiRepository();
const usecase = new GetDanJiListusecase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: GetDanJiListRequestDto = await request.json();

    // 필수 필드 검증
    if (!body.organization) {
      return NextResponse.json(
        { success: false, message: '기관코드는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrSido) {
      return NextResponse.json(
        { success: false, message: '시도 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrSigun) {
      return NextResponse.json(
        { success: false, message: '시군구 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrDong) {
      return NextResponse.json(
        { success: false, message: '읍면동 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    // 단지목록 조회
    const response = await usecase.getDanjiList(body);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '단지목록 조회가 성공적으로 완료되었습니다.',
      result: response.result,
      data: response.data,
      status: 200,
    });
  } catch (error) {
    console.error('단지목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
