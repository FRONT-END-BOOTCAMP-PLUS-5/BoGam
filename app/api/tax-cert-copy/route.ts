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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userAddressId || typeof body.userAddressId !== 'number') {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.taxCertJson) {
      return NextResponse.json(
        { success: false, message: '납세증명서 데이터는 필수입니다.' },
        { status: 400 }
      );
    }

    const repository = new TaxCertCopyRepositoryImpl();
    const useCase = new TaxCertUseCase(repository);

    const updatedTaxCert = await useCase.updateTaxCert(body.userAddressId, {
      taxCertJson: body.taxCertJson
    });

    console.log('✅ 납세증명서 수정 완료:', {
      taxCertId: updatedTaxCert.id,
      userAddressId: updatedTaxCert.userAddressId
    });

    return NextResponse.json({
      success: true,
      message: '납세증명서가 성공적으로 수정되었습니다.',
      data: updatedTaxCert
    });

  } catch (error) {
    console.error('❌ 납세증명서 수정 API 오류:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          message: '해당 사용자 주소의 납세증명서를 찾을 수 없습니다.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: '납세증명서 수정 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    await useCase.deleteTaxCert(userAddressIdNum);

    console.log('✅ 납세증명서 삭제 완료:', {
      userAddressId: userAddressIdNum
    });

    return NextResponse.json({
      success: true,
      message: '납세증명서가 성공적으로 삭제되었습니다.',
      userAddressId: userAddressIdNum
    });

  } catch (error) {
    console.error('❌ 납세증명서 삭제 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '납세증명서 삭제 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}