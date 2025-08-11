import { NextRequest, NextResponse } from 'next/server';
import { TransactionDetailSingleUseCase } from '@be/applications/transactionDetailSingle/usecases/TransactionDetailSingleUseCase';
import { TransactionDetailSingleRequest } from '@be/applications/transactionDetailSingle/dtos/TransactionDetailSingleRequest';

export async function POST(request: NextRequest) {
  try {
    const body: TransactionDetailSingleRequest = await request.json();

    const required: (keyof TransactionDetailSingleRequest)[] = [
      'organization',
      'addrSido',
      'addrSigungu',
      'addrDong',
      'contractYear',
      'contractType',
    ];
    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json(
          { error: '필수 필드가 누락되었습니다.', missingField: k },
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

    const usecase = new TransactionDetailSingleUseCase();
    const response = await usecase.getTransactionDetailSingle(body);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('❌ 단독/다가구 실거래가 조회 실패:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: '알 수 없는 오류' }, { status: 500 });
  }
}
