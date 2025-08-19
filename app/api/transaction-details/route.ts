import { NextRequest, NextResponse } from 'next/server';
import { GetTransactionDetailListUsecase } from '@be/applications/transactionDetails/usecases/GetTransactionDetailListUsecase';
import { GetTransactionDetailRequestDto } from '@be/applications/transactionDetails/dtos/GetTransactionDetailRequestDto';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터에서 apart/single 구분 추출
    const category = searchParams.get('category') as 'apart' | 'single';

    // 카테고리 검증
    if (!category || !['apart', 'single'].includes(category)) {
      return NextResponse.json(
        {
          error:
            'category 파라미터는 필수이며 "apart" 또는 "single"이어야 합니다.',
          receivedValue: category,
        },
        { status: 400 }
      );
    }

    // Request Body 데이터 추출
    const body: GetTransactionDetailRequestDto = await request.json();

    // 공통 필드 검증
    if (!body.organization) {
      return NextResponse.json(
        {
          error: 'organization은 필수입니다.',
          receivedValue: body.organization,
        },
        { status: 400 }
      );
    }

    if (!body.type || !['0', '1', '2'].includes(body.type)) {
      return NextResponse.json(
        {
          error:
            'type은 "0"(아파트), "1"(연립/다세대), "2"(오피스텔) 중 하나여야 합니다.',
          receivedValue: body.type,
        },
        { status: 400 }
      );
    }

    if (!body.contractYear || !/^20\d{2}$/.test(body.contractYear)) {
      return NextResponse.json(
        {
          error: 'contractYear는 필수이며 YYYY 형식이어야 합니다.',
          receivedValue: body.contractYear,
        },
        { status: 400 }
      );
    }

    if (!body.contractType || !['0', '1', '2'].includes(body.contractType)) {
      return NextResponse.json(
        {
          error:
            'contractType은 "0"(전체), "1"(매매), "2"(전월세) 중 하나여야 합니다.',
          receivedValue: body.contractType,
        },
        { status: 400 }
      );
    }

    // 카테고리별 필드 검증
    if (category === 'apart') {
      if (!body.buildingCode) {
        return NextResponse.json(
          { error: 'Apart 카테고리 조회 시 buildingCode는 필수입니다.' },
          { status: 400 }
        );
      }
    } else if (category === 'single') {
      // Single 카테고리 전용 필드 검증
      if (!body.addrSido) {
        return NextResponse.json(
          { error: 'Single 카테고리 조회 시 addrSido는 필수입니다.' },
          { status: 400 }
        );
      }

      if (!body.addrSigungu) {
        return NextResponse.json(
          { error: 'Single 카테고리 조회 시 addrSigungu는 필수입니다.' },
          { status: 400 }
        );
      }

      if (!body.addrDong) {
        return NextResponse.json(
          { error: 'Single 카테고리 조회 시 addrDong은 필수입니다.' },
          { status: 400 }
        );
      }
    }

    // Usecase 실행 (카테고리와 Request DTO를 합쳐서 전달)
    const usecase = new GetTransactionDetailListUsecase();
    const combinedRequest = { category, ...body };
    const response = await usecase.getTransactionDetailList(combinedRequest);

    return NextResponse.json({
      success: true,
      message: `${
        category === 'apart' ? '아파트계열' : '단독/다가구'
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
