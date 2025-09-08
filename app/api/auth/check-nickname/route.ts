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

  return NextResponse.json(result); // 닉네임이 이미 사용중이라면 : true , 아니라면 : false
}
