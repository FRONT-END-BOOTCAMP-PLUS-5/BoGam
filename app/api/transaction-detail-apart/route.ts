import { NextRequest, NextResponse } from 'next/server';
import { TransactionDetailApartUseCase } from '@be/applications/transactionDetailApart/usecases/TransactionDetailApartUseCase';
import { TransactionDetailApartRequest } from '@be/applications/transactionDetailApart/dtos/TransactionDetailApartRequest';

export async function POST(request: NextRequest) {
  try {
    const body: TransactionDetailApartRequest = await request.json();

    const required = [
      'organization',
      'type',
      'buildingCode',
      'contractYear',
      'contractType',
    ] as const;
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json(
          { error: '필수 필드가 누락되었습니다.', missingField: key },
          { status: 400 }
        );
      }
    }

    if (body.organization !== '0010') {
      return NextResponse.json(
        {
          error: '기관코드는 "0010"이어야 합니다.',
          receivedValue: body.organization,
        },
        { status: 400 }
      );
    }

    if (!['0', '1', '2'].includes(body.type)) {
      return NextResponse.json(
        {
          error:
            '구분값은 "0"(아파트), "1"(연립/다세대), "2"(오피스텔) 중 하나여야 합니다.',
          receivedValue: body.type,
        },
        { status: 400 }
      );
    }

    if (!/^20\d{2}$/.test(body.contractYear)) {
      return NextResponse.json(
        {
          error: '계약년도는 YYYY 형식이어야 합니다.',
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

    const useCase = new TransactionDetailApartUseCase();
    const response = await useCase.getTransactionDetailApart(body);

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('❌ 실거래가 조회 API 실패:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: '실거래가 조회 중 오류가 발생했습니다.',
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
