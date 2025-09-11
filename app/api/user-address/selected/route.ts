import { NextRequest, NextResponse } from 'next/server';
import { GetSelectedUserAddressUsecase } from '@be/applications/users/usecases/GetSelectedUserAddressUsecase';
import { UpdateSelectedAddressUsecase } from '@be/applications/users/usecases/UpdateSelectedAddressUsecase';
import { GetUserAddressesRepositoryImpl } from '@be/infrastructure/repository/GetUserAddressesRepositoryImpl';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';

// GET: 선택된 주소 조회
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

// POST: 선택된 주소 상태 업데이트
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userNickname, addressId } = body;

    if (!userNickname || !addressId) {
      return NextResponse.json(
        {
          success: false,
          message: '사용자 닉네임과 주소 ID가 필요합니다.',
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
    const updateSelectedAddressUsecase = new UpdateSelectedAddressUsecase(
      getUserAddressesRepository
    );

    // Use Case 실행
    const result = await updateSelectedAddressUsecase.execute({
      userId: user.id,
      addressId: addressId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ 주소 선택 상태 업데이트 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
