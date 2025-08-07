import { NextRequest, NextResponse } from 'next/server';
import { TaxCertUseCase } from '@be/applications/taxCert/usecases/TaxCertUseCase';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressId = searchParams.get('userAddressId');

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    const userAddressIdNum = parseInt(userAddressId);
    if (isNaN(userAddressIdNum)) {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const repository = new TaxCertCopyRepositoryImpl();
    const useCase = new TaxCertUseCase(repository);

    const taxCerts = await useCase.getTaxCertsByUserAddressId(userAddressIdNum);
    
    // userAddressId당 1개만 존재하므로 첫 번째 요소를 반환
    const taxCert = taxCerts.length > 0 ? taxCerts[0] : null;

    if (!taxCert) {
      return NextResponse.json({
        success: false,
        message: '해당 사용자 주소의 납세증명서를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '납세증명서 조회가 성공적으로 완료되었습니다.',
      data: taxCert
    });

  } catch (error) {
    console.error('❌ 납세증명서 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '납세증명서 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}