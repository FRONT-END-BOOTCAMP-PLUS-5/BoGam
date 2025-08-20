import { prisma } from '@utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');

  if (!nickname) {
    return NextResponse.json(
      { message: '닉네임을 입력해주세요.' },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { nickname },
  });

  return NextResponse.json({ available: !existingUser });
}
