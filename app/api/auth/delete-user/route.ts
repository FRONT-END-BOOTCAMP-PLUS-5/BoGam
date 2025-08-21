import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { DeleteUserUsecase } from '@be/applications/users/usecases/DeleteUserUsecase';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { DeleteUserRequestDto } from '@be/applications/users/dtos/DeleteUserDtos';

export async function DELETE(request: NextRequest) {
  try {
    // JWT 토큰에서 닉네임 추출
    const token = await getToken({ req: request });
    
    if (!token || !token.nickname) {
      return NextResponse.json(
        { success: false, message: '인증되지 않은 요청입니다.' },
        { status: 401 }
      );
    }

    const nickname = token.nickname as string;

    // UseCase 실행
    const userRepository = new UserRepositoryImpl();
    const deleteUserUsecase = new DeleteUserUsecase(userRepository);
    
    const deleteUserRequest: DeleteUserRequestDto = { nickname };
    const result = await deleteUserUsecase.deleteUser(deleteUserRequest);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Delete user API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
