import { NextRequest, NextResponse } from 'next/server';
import { GetTaxCertCopyUsecase } from '@be/applications/taxCertCopies/usecases/GetTaxCertCopyUsecase';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';
import { getUserAddressIdByNickname } from '@utils/userAddress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressNickname = searchParams.get('userAddressNickname');

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, message: '사용자 주소 닉네임은 필수입니다.' },
        { status: 400 }
      );
    }

    // userAddress 닉네임으로부터 ID 가져오기
    const userAddressId = await getUserAddressIdByNickname(userAddressNickname);
    if (!userAddressId) {
      return NextResponse.json(
        {
          success: false,
          message: '유효하지 않은 사용자 주소 닉네임입니다.',
          error: 'INVALID_USER_ADDRESS_NICKNAME',
        },
        { status: 400 }
      );
    }

    const repository = new TaxCertCopyRepositoryImpl();
    const usecase = new GetTaxCertCopyUsecase(repository);

    const taxCert = await usecase.getTaxCertCopy({ userAddressId });

    if (!taxCert) {
      return NextResponse.json(
        {
          success: false,
          message: '해당 사용자 주소의 납세증명서를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '납세증명서 조회가 성공적으로 완료되었습니다.',
      data: taxCert,
    });
  } catch (error) {
    console.error('❌ 납세증명서 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '납세증명서 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
