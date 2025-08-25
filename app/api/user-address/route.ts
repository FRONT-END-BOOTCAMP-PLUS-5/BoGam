import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/auth';
import { AddUserAddressUsecase } from '@be/applications/users/usecases/AddUserAddressUsecase';
import { DeleteUserAddressUsecase } from '@be/applications/users/usecases/DeleteUserAddressUsecase';
import { AddUserAddressRepositoryImpl } from '@be/infrastructure/repository/AddUserAddressRepositoryImpl';
import { DeleteUserAddressRepositoryImpl } from '@be/infrastructure/repository/DeleteUserAddressRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { AddUserAddressRequestDto } from '@be/applications/users/dtos/AddUserAddressDto';
import { DeleteUserAddressRequestDto } from '@be/applications/users/dtos/DeleteUserAddressDto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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
      !body.dong
    ) {
      return NextResponse.json(
        { success: false, message: '주소 정보가 불완전합니다.' },
        { status: 400 }
      );
    }

    // Usecase 실행
    const userAddressRepository = new AddUserAddressRepositoryImpl();
    const userRepository = new UserRepositoryImpl();
    const addUserAddressUsecase = new AddUserAddressUsecase(
      userAddressRepository,
      userRepository
    );

    const result = await addUserAddressUsecase.addUserAddress(
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.nickname) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userAddressId = searchParams.get('userAddressId');

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // DeleteUserAddressUsecase 실행
    const deleteUserAddressRepository = new DeleteUserAddressRepositoryImpl();
    const deleteUserAddressUsecase = new DeleteUserAddressUsecase(
      deleteUserAddressRepository
    );
    
    const requestDto: DeleteUserAddressRequestDto = {
      userAddressId: parseInt(userAddressId)
    };

    const result = await deleteUserAddressUsecase.deleteUserAddress(
      session.user.nickname,
      requestDto
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('UserAddress DELETE API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
