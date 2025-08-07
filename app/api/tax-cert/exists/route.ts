import { NextRequest, NextResponse } from 'next/server';
import { TaxCertCopyUseCase } from '@be/applications/taxCertCopy/usecase/TaxCertCopyUseCase';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';
import { getUserAddressIdByNickname } from '@utils/userAddress';
import { TaxCertCopyExistsResponseDto } from '@be/applications/taxCertCopy/dtos/TaxCertCopyDto';

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
    const userAddressId = await getUserAddressIdByNickname(nickname);
    
    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: '해당 닉네임의 주소를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const taxCertCopyRepository = new TaxCertCopyRepositoryImpl();
    const taxCertCopyUseCase = new TaxCertCopyUseCase(taxCertCopyRepository);
    
    const result = await taxCertCopyUseCase.existsByUserAddressId(userAddressId);

    const response: TaxCertCopyExistsResponseDto = {
      success: true,
      exists: result.exists,
      updatedAt: result.updatedAt
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('❌ 납세확인서 복사본 존재 여부 확인 API 오류:', error);
    
    const errorResponse: TaxCertCopyExistsResponseDto = {
      success: false,
      exists: false,
      error: '납세확인서 복사본 존재 여부 확인 중 오류가 발생했습니다.'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
