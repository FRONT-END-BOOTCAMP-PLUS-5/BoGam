import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../libs/auth';

/**
 * 세션에서 user nickname을 추출하는 함수
 * @returns user nickname 또는 null
 */
export async function getUserNicknameFromSession(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.nickname || null;
  } catch (error) {
    console.error('❌ 세션에서 user nickname 추출 실패:', error);
    return null;
  }
}

/**
 * user nickname으로 user id를 추출하는 함수
 * @param nickname user nickname
 * @returns user id 또는 null
 */
export async function getUserIdByNickname(nickname: string): Promise<string | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true }
    });

    return user?.id || null;
  } catch (error) {
    console.error('❌ user ID 조회 실패:', error);
    return null;
  }
}

/**
 * user address nickname으로 userAddress ID를 조회하는 함수 (세션에서 자동으로 userId 추출)
 * @param nickname userAddress 닉네임
 * @returns userAddress ID 또는 null
 */
export async function getUserAddressId(
  nickname: string
): Promise<number | null> {
  try {
    console.log('🔍 getUserAddressId 호출:', { nickname });
    
    // 세션에서 user nickname 추출
    const userNickname = await getUserNicknameFromSession();
    console.log('🔍 세션에서 추출한 userNickname:', userNickname);
    
    if (!userNickname) {
      console.error('❌ 세션에서 user nickname을 가져올 수 없습니다.');
      return null;
    }

    // user nickname으로 user id 추출
    const userId = await getUserIdByNickname(userNickname);
    console.log('🔍 userNickname으로 조회한 userId:', userId);
    
    if (!userId) {
      console.error('❌ user ID를 가져올 수 없습니다.');
      return null;
    }

    // userAddress 조회
    console.log('🔍 userAddress 조회 파라미터:', { nickname, userId });
    const userAddress = await prisma.userAddress.findFirst({
      where: { 
        nickname,
        userId 
      },
      select: { id: true }
    });
    console.log('🔍 조회된 userAddress:', userAddress);

    return userAddress?.id || null;
  } catch (error) {
    console.error('❌ userAddress ID 조회 실패:', error);
    return null;
  }
}