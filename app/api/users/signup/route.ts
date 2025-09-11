import bcrypt from 'bcrypt';
import { prisma } from '@utils/prisma';
import { NextResponse } from 'next/server';
import { formatPhone } from '@utils/formatUtils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, nickname, username, password, pinNumber, phoneNumber } = body;

    // 필수 필드 누락 검사
    if (
      !name ||
      !nickname ||
      !username ||
      !password ||
      !pinNumber ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 중복 검사
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ nickname }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '다른 사람이 사용하는 닉네임입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 & 핀 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pinNumber, 10);
    const formattedPhone = formatPhone(phoneNumber);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        nickname,
        username,
        password: hashedPassword,
        pinNumber: hashedPin,
        phoneNumber: formattedPhone,
      },
    });

    return NextResponse.json(
      { message: '회원가입 성공', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
//HTTP 메서드 제한 (POST 외 방지)
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
