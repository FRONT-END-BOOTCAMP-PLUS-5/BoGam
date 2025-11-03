import { NextRequest, NextResponse } from 'next/server';
import { CheckTransactionSearchExistsUsecase } from '@be/applications/transactionSearches/usecases/CheckTransactionSearchExistsUsecase';
import { TransactionSearchRepositoryImpl } from '@be/infrastructure/repository/TransactionSearchRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressNickname = searchParams.get('userAddressNickname');

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const userAddressId = await getUserAddressId(userAddressNickname);
    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: '주소 닉네임을 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    const transactionSearchRepository = new TransactionSearchRepositoryImpl();
    const checkTransactionSearchExistsUsecase = new CheckTransactionSearchExistsUsecase(
      transactionSearchRepository
    );

    const result = await checkTransactionSearchExistsUsecase.checkExists({
      userAddressId: userAddressId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('TransactionSearchExists API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
