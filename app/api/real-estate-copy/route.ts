import { NextRequest, NextResponse } from 'next/server';
import { RealEstateCopyUseCase } from '@be/applications/realEstateCopy/usecases/RealEstateCopyUseCase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';

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

    const repository = new RealEstateCopyRepositoryImpl();
    const useCase = new RealEstateCopyUseCase(repository);

    const realEstateCopies = await useCase.getRealEstateCopiesByUserAddressId(userAddressIdNum);
    
    // userAddressId당 1개만 존재하므로 첫 번째 요소를 반환
    const realEstateCopy = realEstateCopies.length > 0 ? realEstateCopies[0] : null;

    if (!realEstateCopy) {
      return NextResponse.json({
        success: false,
        message: '해당 사용자 주소의 등기부등본을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: '등기부등본 조회가 성공적으로 완료되었습니다.',
      data: realEstateCopy
    });

  } catch (error) {
    console.error('❌ 등기부등본 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '등기부등본 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userAddressId || typeof body.userAddressId !== 'number') {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.realEstateJson) {
      return NextResponse.json(
        { success: false, message: '등기부등본 데이터는 필수입니다.' },
        { status: 400 }
      );
    }

    const repository = new RealEstateCopyRepositoryImpl();
    const useCase = new RealEstateCopyUseCase(repository);

    const upsertedRealEstateCopy = await useCase.upsertRealEstateCopy({
      userAddressId: body.userAddressId,
      realEstateJson: body.realEstateJson
    });

    console.log('✅ 등기부등본 upsert 완료:', {
      realEstateCopyId: upsertedRealEstateCopy.id,
      userAddressId: upsertedRealEstateCopy.userAddressId
    });

    return NextResponse.json({
      success: true,
      message: '등기부등본이 성공적으로 저장되었습니다.',
      data: upsertedRealEstateCopy
    });

  } catch (error) {
    console.error('❌ 등기부등본 upsert API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '등기부등본 저장 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}