import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/auth';
import { GetUserAddressesUsecase } from '@be/applications/users/usecases/GetUserAddressesUsecase';
import { GetUserAddressesRepositoryImpl } from '@be/infrastructure/repository/GetUserAddressesRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.nickname) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // Usecase 실행
    const userAddressRepository = new GetUserAddressesRepositoryImpl();
    const userRepository = new UserRepositoryImpl();
    const getUserAddressesUsecase = new GetUserAddressesUsecase(
      userAddressRepository,
      userRepository
    );

    const result = await getUserAddressesUsecase.getUserAddresses(
      session.user.nickname
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('GetUserAddresses API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
