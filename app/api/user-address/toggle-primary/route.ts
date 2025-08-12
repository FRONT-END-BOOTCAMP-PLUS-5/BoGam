import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/auth';
import { TogglePrimaryAddressUsecase } from '@be/applications/users/usecases/TogglePrimaryAddressUsecase';
import { TogglePrimaryAddressRepositoryImpl } from '@be/infrastructure/repository/TogglePrimaryAddressRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { TogglePrimaryAddressRequestDto } from '@be/applications/users/dtos/TogglePrimaryAddressDto';

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

    // Usecase 실행
    const userAddressRepository = new TogglePrimaryAddressRepositoryImpl();
    const userRepository = new UserRepositoryImpl();
    const togglePrimaryAddressUsecase = new TogglePrimaryAddressUsecase(
      userAddressRepository,
      userRepository
    );

    const result = await togglePrimaryAddressUsecase.updatePrimaryAddress(
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
