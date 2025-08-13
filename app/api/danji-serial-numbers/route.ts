import { NextRequest, NextResponse } from 'next/server';
import { DanjiSerialNumberUsecase } from '@be/applications/danjiSerialNumbers/usecases/DanjiSerialNumberUsecase';
import { DanjiSerialNumberRequestDto } from '@be/applications/danjiSerialNumbers/dtos/DanjiSerialNumberRequestDto';
import { DanjiSerialNumberRepositoryImpl } from '@be/infrastructure/repository/DanjiSerialNumberRepositoryImsi';

/**
 * 단지 일련번호 조회 API
 * POST /api/complex-serial-number
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: DanjiSerialNumberRequestDto = await request.json();

    // 필수 필드 검증
    const requiredFields = [
      'organization',
      'year',
      'type',
      'searchGbn',
      'addrSido',
      'addrSigun',
      'addrDong',
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof DanjiSerialNumberRequestDto]) {
        return NextResponse.json(
          {
            error: '필수 필드가 누락되었습니다.',
            missingField: field,
          },
          { status: 400 }
        );
      }
    }

    // 구분값 검증
    const validTypes = ['0', '1', '2'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error:
            '구분값은 "0"(아파트), "1"(연립/다세대), "2"(오피스텔) 중 하나여야 합니다.',
          receivedValue: body.type,
        },
        { status: 400 }
      );
    }

    // 조회구분값 검증
    const validSearchGbns = ['0', '1'];
    if (!validSearchGbns.includes(body.searchGbn)) {
      return NextResponse.json(
        {
          error:
            '조회구분값은 "0"(지번주소), "1"(도로명주소) 중 하나여야 합니다.',
          receivedValue: body.searchGbn,
        },
        { status: 400 }
      );
    }

    // Usecase 인스턴스 생성 및 API 호출
    const usecase = new DanjiSerialNumberUsecase(new DanjiSerialNumberRepositoryImpl());
    const response = await usecase.getDanjiSerialNumber(body);

    console.log('✅ 단지 일련번호 조회 API 성공:', {
      resultCode: response.result?.code,
      resultMessage: response.result?.message,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('❌ 단지 일련번호 조회 API 실패:', error);

    // 에러 타입에 따른 응답
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: '단지 일련번호 조회 중 오류가 발생했습니다.',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
