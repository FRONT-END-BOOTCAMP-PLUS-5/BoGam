import { NextRequest, NextResponse } from 'next/server';
import { CheckTaxCertCopyExistsUsecase } from '@be/applications/taxCertCopies/usecases/CheckTaxCertCopyExistsUsecase';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get('nickname');

    if (!nickname) {
      return NextResponse.json(
        { success: false, error: 'nickname이 필요합니다.' },
        { status: 400 }
      );
    }

    // 닉네임을 userAddressId로 변환
    const userAddressId = await getUserAddressId(nickname);

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: '해당 닉네임의 주소를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const repository = new TaxCertCopyRepositoryImpl();
    const usecase = new CheckTaxCertCopyExistsUsecase(repository);

    const response = await usecase.checkExists({ userAddressId });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('❌ 납세확인서 복사본 존재 여부 확인 API 오류:', error);

    return NextResponse.json(
      {
        success: false,
        exists: false,
        error: '납세확인서 복사본 존재 여부 확인 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
