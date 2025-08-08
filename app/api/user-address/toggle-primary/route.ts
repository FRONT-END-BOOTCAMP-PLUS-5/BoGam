import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/auth';
import { TogglePrimaryAddressUseCase } from '@be/applications/place/usecases/TogglePrimaryAddressUseCase';
import { TogglePrimaryAddressRepositoryImpl } from '@be/infrastructure/repository/TogglePrimaryAddressRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { TogglePrimaryAddressRequestDto } from '@be/applications/place/dtos/TogglePrimaryAddressDto';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.nickname) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: TogglePrimaryAddressRequestDto = await request.json();

    // 필수 필드 검증
    if (!body.userAddressId) {
      return NextResponse.json(
        { success: false, message: 'userAddressId는 필수입니다.' },
        { status: 400 }
      );
    }

    // UseCase 실행
    const userAddressRepository = new TogglePrimaryAddressRepositoryImpl();
    const userRepository = new UserRepositoryImpl();
    const togglePrimaryAddressUseCase = new TogglePrimaryAddressUseCase(
      userAddressRepository,
      userRepository
    );

    const result = await togglePrimaryAddressUseCase.updatePrimaryAddress(
      session.user.nickname,
      body
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('TogglePrimaryAddress API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
