import { NextRequest, NextResponse } from 'next/server';
import { DanJiUseCase } from '@/backend/danJi/applications/usecases/DanJiUseCase';
import { DanJiRepository } from '@/backend/danJi/infrastuctures/repositories/DanJiRepository';
import { DanJiRequest } from '@/backend/danJi/applications/dtos/DanJiDto';

const repository = new DanJiRepository();
const useCase = new DanJiUseCase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: DanJiRequest = await request.json();

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
    const response = await useCase.getDanJiList(body);

    // 단지목록 데이터 추출
    const danJiList = useCase.extractDanJiList(response);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '단지목록 조회가 성공적으로 완료되었습니다.',
      data: {
        result: response.result,
        danJiList,
        rawData: response.data,
      },
    });
  } catch (error) {
    console.error('단지목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
