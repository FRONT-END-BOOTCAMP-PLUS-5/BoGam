import { NextRequest, NextResponse } from 'next/server';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';
import { TaxCertUseCase } from '@be/applications/taxCert/usecases/TaxCertUseCase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';
import { RealEstateCopyUseCase } from '@be/applications/realEstateCopy/usecases/RealEstateCopyUseCase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { userAddressId, type } = body;
    
    if (!userAddressId || typeof userAddressId !== 'number') {
      return NextResponse.json({
        success: false,
        message: 'userAddressId는 필수이며 숫자여야 합니다.'
      }, { status: 400 });
    }

    if (!type || (type !== 'tax-cert' && type !== 'real-estate')) {
      return NextResponse.json({
        success: false,
        message: 'type은 "tax-cert" 또는 "real-estate"여야 합니다.'
      }, { status: 400 });
    }

    let hasExistingData = false;
    let existingData = null;

    if (type === 'tax-cert') {
      const repository = new TaxCertCopyRepositoryImpl();
      const useCase = new TaxCertUseCase(repository);
      existingData = await useCase.findTaxCertByUserAddressId(userAddressId);
      hasExistingData = !!existingData;
    } else if (type === 'real-estate') {
      const repository = new RealEstateCopyRepositoryImpl();
      const useCase = new RealEstateCopyUseCase(repository);
      existingData = await useCase.findRealEstateCopyByUserAddressId(userAddressId);
      hasExistingData = !!existingData;
    }

    return NextResponse.json({
      success: true,
      hasExistingData,
      existingData: hasExistingData ? {
        id: existingData!.id,
        userAddressId: existingData!.userAddressId,
        createdAt: existingData!.createdAt,
        updatedAt: existingData!.updatedAt
      } : null
    });

  } catch (error) {
    console.error('❌ 기존 데이터 확인 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '기존 데이터 확인 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}