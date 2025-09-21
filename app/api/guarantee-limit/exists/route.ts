import { NextRequest, NextResponse } from 'next/server';
import { CheckGuaranteeLimitCopyExistsUsecase } from '@be/applications/guaranteeLimitCopies/usecases/CheckGuaranteeLimitCopyExistsUsecase';
import { GuaranteeLimitCopyRepositoryImpl } from '@be/infrastructure/repository/GuaranteeLimitCopyRepositoryImpl';
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

    const guaranteeLimitCopyRepository = new GuaranteeLimitCopyRepositoryImpl();
    const checkGuaranteeLimitCopyExistsUsecase = new CheckGuaranteeLimitCopyExistsUsecase(
      guaranteeLimitCopyRepository
    );

    const result = await checkGuaranteeLimitCopyExistsUsecase.checkExists({
      userAddressId: userAddressId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('GuaranteeLimitExists API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
