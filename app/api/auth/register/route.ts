import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@utils/prisma';
import { UserRepositoryImpl } from '@be/infrastructure/repository/UserRepository';
import { RegisterRequestDto } from '@be/applications/auth/dtos/LoginDtos';
import { SignUpUseCase } from '@be/applications/user/usecases/SignUpUseCase';

const userRepository = new UserRepositoryImpl(prisma);
const signUpUseCase = new SignUpUseCase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequestDto = await request.json();

    const result = await signUpUseCase.register(body);

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
