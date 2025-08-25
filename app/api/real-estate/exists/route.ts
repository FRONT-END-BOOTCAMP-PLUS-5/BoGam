import { NextRequest, NextResponse } from 'next/server';
import { CheckRealEstateCopyExistsUsecase } from '@be/applications/realEstateCopies/usecases/CheckRealEstateCopyExistsUsecase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddressNickname } = body;

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname이 필요합니다.' },
        { status: 400 }
      );
    }

    // userAddressNickname을 userAddressId로 변환 (서버에서 처리)
    const userAddressId = await getUserAddressId(userAddressNickname);

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: '해당 닉네임의 주소를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    const repository = new RealEstateCopyRepositoryImpl();
    const usecase = new CheckRealEstateCopyExistsUsecase(repository);

    const response = await usecase.checkExists({ userAddressId });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('❌ 등기부등본 복사본 존재 여부 확인 API 오류:', error);

    return NextResponse.json(
      {
        success: false,
        exists: false,
        error: '등기부등본 복사본 존재 여부 확인 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
