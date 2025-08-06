import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/auth';
import { AddUserAddressUseCase } from '@be/applications/place/usecases/AddUserAddressUseCase';
import { AddUserAddressRepositoryImpl } from '@be/infrastructure/repository/AddUserAddressRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { AddUserAddressRequestDto } from '@be/applications/place/dtos/AddUserAddressDto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log('session', session);

    if (!session?.user?.nickname) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: AddUserAddressRequestDto = await request.json();

    // 필수 필드 검증
    if (
      !body.latitude ||
      !body.longitude ||
      !body.legalDistrictCode ||
      !body.dong ||
      !body.ho
    ) {
      return NextResponse.json(
        { success: false, message: '주소 정보가 불완전합니다.' },
        { status: 400 }
      );
    }

    // UseCase 실행
    const userAddressRepository = new AddUserAddressRepositoryImpl();
    const userRepository = new UserRepositoryImpl();
    const addUserAddressUseCase = new AddUserAddressUseCase(
      userAddressRepository,
      userRepository
    );

    const result = await addUserAddressUseCase.execute(
      session.user.nickname,
      body
    );

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    console.error('UserAddress API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
