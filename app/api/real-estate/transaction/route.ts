//실거래가 확인 api

import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateTransactionUseCase } from '@be/realEstate/applications/usecases/GetRealEstateTransactionUseCase';

const useCase = new GetRealEstateTransactionUseCase();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const LAWD_CD = searchParams.get('LAWD_CD');
    const DEAL_YMD = searchParams.get('DEAL_YMD');
    const numOfRows = searchParams.get('numOfRows');
    const pageNo = searchParams.get('pageNo');

    // 요청 검증
    if (!LAWD_CD) {
      return NextResponse.json(
        { success: false, message: '지역코드(LAWD_CD)는 필수입니다.' },
        { status: 400 }
      );
    }

    if (LAWD_CD.length !== 5) {
      return NextResponse.json(
        { success: false, message: '지역코드는 5자리 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (!DEAL_YMD) {
      return NextResponse.json(
        { success: false, message: '계약년월(DEAL_YMD)은 필수입니다.' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(DEAL_YMD)) {
      return NextResponse.json(
        { success: false, message: '계약년월은 YYYYMM 형식(6자리 숫자)이어야 합니다.' },
        { status: 400 }
      );
    }

    // UseCase 호출
    const response = await useCase.getTransactionByLocationAndDate(
      LAWD_CD,
      DEAL_YMD,
      {
        numOfRows: numOfRows || '10',
        pageNo: pageNo || '1',
      }
    );

    // 응답 검증
    const validationResult = useCase.validateResponse(response);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { success: false, message: validationResult.message },
        { status: 400 }
      );
    }

    // 실거래가 목록 추출
    const transactionList = useCase.getTransactionList(response);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '실거래가 조회가 성공적으로 완료되었습니다.',
      data: {
        header: response.header,
        transactionList,
        pagination: {
          numOfRows: (response.body as any)?.numOfRows || '10',
          pageNo: (response.body as any)?.pageNo || '1',
          totalCount: (response.body as any)?.totalCount || '0',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 