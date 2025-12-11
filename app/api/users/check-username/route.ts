import { NextRequest, NextResponse } from 'next/server';
import { IsUsernameTakenUseCase } from '@be/applications/users/usecases/IsUsernameTakenUseCase';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { message: '아이디(이메일)를 입력해주세요.' },
        { status: 400 }
      );
    }

    const useCase = new IsUsernameTakenUseCase(new UserRepositoryImpl());
    const result = await useCase.execute(username);

    // 반환 형태:
    // { available: true } : 사용 가능
    // { available: false } : 중복
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { message: '서버 에러가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
