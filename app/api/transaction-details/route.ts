import { NextRequest, NextResponse } from 'next/server';
import { GetTransactionDetailListusecase } from '@be/applications/transactionDetails/usecases/GetTransactionDetailListusecase';
import {
  GetTransactionDetailRequestDto,
  GetTransactionDetailQueryDto,
} from '@be/applications/transactionDetails/dtos/GetTransactionDetailRequestDto';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터에서 타입 추출
    const type = searchParams.get('type') as 'apart' | 'single';

    // 타입 검증
    if (!type || !['apart', 'single'].includes(type)) {
      return NextResponse.json(
        {
          error: 'type 파라미터는 필수이며 "apart" 또는 "single"이어야 합니다.',
          receivedValue: type,
        },
        { status: 400 }
      );
    }

    // Query DTO 생성
    const queryDto: GetTransactionDetailQueryDto = {
      type,
    };

    // Request Body 데이터 추출
    const body: GetTransactionDetailRequestDto = await request.json();

    // 공통 필드 검증
    if (!body.contractYear || !/^20\d{2}$/.test(body.contractYear)) {
      return NextResponse.json(
        {
          error: '계약년도는 필수이며 YYYY 형식이어야 합니다.',
          receivedValue: body.contractYear,
        },
        { status: 400 }
      );
    }

    if (!['0', '1', '2'].includes(body.contractType)) {
      return NextResponse.json(
        {
          error:
            '계약구분은 "0"(전체), "1"(매매), "2"(전월세) 중 하나여야 합니다.',
          receivedValue: body.contractType,
        },
        { status: 400 }
      );
    }

    // 타입별 필드 검증
    if (type === 'apart') {
      // Apart 타입 전용 필드 검증
      if (!body.apartType || !['0', '1', '2'].includes(body.apartType)) {
        return NextResponse.json(
          {
            error:
              'Apart 타입 조회 시 apartType은 필수이며 "0"(아파트), "1"(연립/다세대), "2"(오피스텔) 중 하나여야 합니다.',
            receivedValue: body.apartType,
          },
          { status: 400 }
        );
      }

      if (!body.buildingCode) {
        return NextResponse.json(
          { error: 'Apart 타입 조회 시 buildingCode는 필수입니다.' },
          { status: 400 }
        );
      }
    } else if (type === 'single') {
      // Single 타입 전용 필드 검증
      if (!body.addrSido) {
        return NextResponse.json(
          { error: 'Single 타입 조회 시 addrSido는 필수입니다.' },
          { status: 400 }
        );
      }

      if (!body.addrSigungu) {
        return NextResponse.json(
          { error: 'Single 타입 조회 시 addrSigungu는 필수입니다.' },
          { status: 400 }
        );
      }

      if (!body.addrDong) {
        return NextResponse.json(
          { error: 'Single 타입 조회 시 addrDong은 필수입니다.' },
          { status: 400 }
        );
      }
    }

    // Usecase 실행 (Query와 Request DTO를 합쳐서 전달)
    const usecase = new GetTransactionDetailListusecase();
    const combinedRequest = { ...queryDto, ...body };
    const response = await usecase.getTransactionDetailList(combinedRequest);

    return NextResponse.json({
      success: true,
      message: `${
        type === 'apart' ? '아파트계열' : '단독/다가구'
      } 실거래가 상세조회가 성공적으로 완료되었습니다.`,
      data: response,
      hasData: usecase.hasData(response),
    });
  } catch (error: unknown) {
    console.error('❌ 통합 실거래가 상세조회 API 실패:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: '실거래가 상세조회 중 오류가 발생했습니다.',
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: '알 수 없는 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
