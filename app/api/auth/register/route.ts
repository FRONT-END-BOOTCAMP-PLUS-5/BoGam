import { NextRequest, NextResponse } from 'next/server';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepositoryImpl';
import { RegisterRequestDto } from '@be/applications/users/dtos/SignUpDtos';
import { SignUpusecase } from '@be/applications/users/usecases/SignUpusecase';

const userRepository = new UserRepositoryImpl();
const signUpusecase = new SignUpusecase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequestDto = await request.json();

    const result = await signUpusecase.signUp(body);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
