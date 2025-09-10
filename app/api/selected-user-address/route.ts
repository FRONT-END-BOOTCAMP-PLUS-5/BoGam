import { NextRequest, NextResponse } from 'next/server';
import { GetSelectedUserAddressUsecase } from '@be/applications/users/usecases/GetSelectedUserAddressUsecase';
import { GetUserAddressesRepositoryImpl } from '@be/infrastructure/repository/GetUserAddressesRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userNickname = searchParams.get('userNickname');

    if (!userNickname) {
      return NextResponse.json(
        {
          success: false,
          message: '사용자 닉네임이 필요합니다.',
        },
        { status: 400 }
      );
    }

    // nickname을 userId로 변환
    const userRepository = new UserRepositoryImpl();
    const user = await userRepository.findByNickname(userNickname);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '사용자를 찾을 수 없습니다.',
        },
        { status: 404 }
      );
    }

    // Use Case 인스턴스 생성
    const getUserAddressesRepository = new GetUserAddressesRepositoryImpl();
    const getSelectedUserAddressUsecase = new GetSelectedUserAddressUsecase(
      getUserAddressesRepository
    );

    // Use Case 실행
    const result = await getSelectedUserAddressUsecase.execute({
      userId: user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ 선택된 사용자 주소 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
