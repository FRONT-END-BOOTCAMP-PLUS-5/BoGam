import { NextRequest, NextResponse } from 'next/server';
import { IsNicknameTakenUseCase } from '@be/applications/users/usecases/IsNicknameTakenUseCase';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');

  if (!nickname) {
    return NextResponse.json(
      { message: '닉네임을 입력해주세요.' },
      { status: 400 }
    );
  }

  const useCase = new IsNicknameTakenUseCase(new UserRepositoryImpl());
  const result = await useCase.execute(nickname);

  // 반환 형태 예시
  //{ available: true } : 사용 가능
  //{ available: false }  : 중복

  return NextResponse.json(result);
}
