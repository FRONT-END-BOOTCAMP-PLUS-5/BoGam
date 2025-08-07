import { NextRequest, NextResponse } from 'next/server';
import { RealEstateCopyUseCase } from '@be/applications/realEstateCopy/usecases/RealEstateCopyUseCase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';
import { getUserAddressIdByNickname } from '@utils/userAddress';
import { RealEstateCopyExistsResponseDto } from '@be/applications/realEstateCopy/dtos/RealEstateCopyDto';

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

    const realEstateCopyRepository = new RealEstateCopyRepositoryImpl();
    const realEstateCopyUseCase = new RealEstateCopyUseCase(realEstateCopyRepository);
    
    const result = await realEstateCopyUseCase.existsByUserAddressId(userAddressId);

    const response: RealEstateCopyExistsResponseDto = {
      success: true,
      exists: result.exists,
      updatedAt: result.updatedAt
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ 등기부등본 복사본 존재 여부 확인 API 오류:', error);
    
    const errorResponse: RealEstateCopyExistsResponseDto = {
      success: false,
      exists: false,
      error: '등기부등본 복사본 존재 여부 확인 중 오류가 발생했습니다.'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
