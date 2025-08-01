import { NextRequest, NextResponse } from 'next/server';
import { SiseUseCase } from '@be/applications/sise/usecases/SiseUseCase';
import { SiseRepository } from '@be/infrastructure/repository/SiseRepository';
import {
  SiseRequest,
  SiseTwoWayRequest,
} from '@be/applications/sise/dtos/SiseDto';

const repository = new SiseRepository();
const useCase = new SiseUseCase(repository);

export async function POST(request: NextRequest) {
  try {
    // // 요청 본문이 비어있는지 확인
    // const contentType = request.headers.get('content-type');
    // if (!contentType || !contentType.includes('application/json')) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: 'Content-Type이 application/json이어야 합니다.',
    //     },
    //     { status: 400 }
    //   );
    // }

    // 요청 본문 파싱
    let body: SiseRequest | SiseTwoWayRequest;

    try {
      body = await request.json();

      if (!body) {
        return NextResponse.json(
          { success: false, message: '요청 본문이 비어있습니다.' },
          { status: 400 }
        );
      }
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      return NextResponse.json(
        { success: false, message: '올바르지 않은 JSON 형식입니다.' },
        { status: 400 }
      );
    }

    // 필수 필드 검증
    if (!body.organization) {
      return NextResponse.json(
        { success: false, message: '기관코드는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.searchGbn) {
      return NextResponse.json(
        { success: false, message: '조회구분은 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.complexNo) {
      return NextResponse.json(
        { success: false, message: '단지번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // searchGbn에 따른 추가 검증
    if (body.searchGbn === '2' && !body.dong) {
      return NextResponse.json(
        { success: false, message: '동 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    if (body.searchGbn === '2' && !body.ho) {
      return NextResponse.json(
        { success: false, message: '호 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    // 시세정보 조회
    const response = await useCase.fetchSiseInfo(body);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '시세정보 조회가 성공적으로 완료되었습니다.',
      data: response,
      status: 200,
    });
  } catch (error) {
    console.error('시세정보 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
